let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取接口配置信息
    let configFunc = extrequire("GT37595AT2.commonFun.configParamsFun");
    let config = configFunc.execute("", null);
    let sconfigFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let sconfig = sconfigFunc.execute();
    let header = { "Content-Type": "application/json", "X-HW-ID": sconfig.BASE.X_HW_ID, "X-HW-APPKEY": sconfig.BASE.X_HW_APPKEY };
    //查询要货计划变更指令【供应商同步状态(sysncStatus)】为1（未同步）--1未同步 2已同步
    var queryConditionMap = { sysncStatus: "1" };
    var orderChangeResutData = ObjectStore.selectByMap("GT37595AT2.GT37595AT2.orderChangeInstructFinal", queryConditionMap);
    if (!orderChangeResutData || orderChangeResutData.length == 0) {
      return { status: 1 };
    }
    let idsSet = new Set(); // 需要更新的要货计划ID
    let poNumberSet = new Set(); // 变更指令的需求号，用于调S接口获取对应需求号的最新要货计划
    let changeMap = new Map(); // 存放同一需求号+批次号的数据
    for (let i = 0; i < orderChangeResutData.length; i++) {
      let orderChangeObj = orderChangeResutData[i];
      let mapKey = orderChangeObj.orderHeaderNum + "_" + orderChangeObj.batchNo;
      poNumberSet.add(orderChangeObj.orderHeaderNum);
      if (changeMap.has(mapKey)) {
        let exitObjs = changeMap.get(mapKey);
        exitObjs.push(orderChangeObj);
        changeMap.set(mapKey, exitObjs);
      } else {
        changeMap.set(mapKey, [orderChangeObj]);
      }
    }
    let poNumbers = [...poNumberSet];
    let exeShiRequestDate = getDate();
    let shitUrl = sconfig.BASE.URL + "/api/service/esupplier/findCpoResult/1.0.0?suffix_path=/100/1";
    let shiBody = { vendorCode: sconfig.BASE.SUPPLIER_CODE, poNumberList: poNumbers };
    let shiApiResponse = postman("post", shitUrl, JSON.stringify(header), JSON.stringify(shiBody));
    let exeShiResponseDate = getDate();
    let resShiData = JSON.parse(shiApiResponse);
    // 记录日志
    try {
      let logObj = { methodName: "findCpoResult", requestParams: JSON.stringify(shiBody), requestTime: exeShiRequestDate, respResult: shiApiResponse, respTime: exeShiResponseDate, url: shitUrl };
      var resLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
    } catch (e) {}
    if (!resShiData || !resShiData.result) {
      // 接口没有数据，直接返回
      return { status: 1 };
    }
    let shiResult = resShiData.result;
    let errorObjsMap = new Map(); // 已审核或审核中的采购订单不更新，并回写原因
    let pushObjs = []; // 推送供应商的变更指令对象
    let updateOrderChangeObjs = []; // 推送供应商的变更指令对象
    let fieldSMapping = {
      requested_ship_date: "crd",
      requested_quantity: "oriRequestedQuantity",
      ship_to_location: "shipToLocation",
      ship_to_contact: "shipToContact",
      ship_to_contact_phone: "shipToContactPhone",
      dc_name_cn: "dcNameCn"
    };
    let shiMapping = { nodeNumber: "quantitiy" };
    let pushMapping = {
      dcNameCn: "dateCenter",
      rsd: "latestRsd",
      shipToLocation: "shipToAddress",
      shipToContact: "shipToContact",
      shipToContactPhone: "shipToContactTel",
      country: "shipToContry",
      province: "shipToProvince",
      city: "shipToCity",
      oriRequestedQuantity: "qty"
    };
    changeMap.forEach((value, key) => {
      let splits = key.split("_");
      // 查询要货计划对象做更新
      let searchSql =
        "select id,(select * from shippingschedulebList) shippingschedulebList from GT37595AT2.GT37595AT2.shippingschedule where shippingschedulebList.item_type = '" +
        splits[0] +
        "' and shippingschedulebList.batchNumber = '" +
        splits[1] +
        "'";
      let searchRes = ObjectStore.queryByYonQL(searchSql);
      if (searchRes && searchRes.length > 0) {
        value.forEach((item) => {
          let updateShiObjs = [];
          let poCodes = [];
          let mappings = [];
          let orderMap = new Map(); // 存放当前指令需要求改的行的字段
          let field = item.changeField;
          if (field) {
            field = field.replace(" ", "").replace("order_fulsch_demand_header_t:", "").replace("order_fulsch_demand_line_t:", "");
          }
          if (fieldSMapping[field]) {
            field = fieldSMapping[field];
          }
          for (let j = 0; j < searchRes.length; j++) {
            let shiItem = searchRes[j];
            let shiUpdateObj = {};
            let updateShiDetails = [];
            for (let a = 0; a < shiItem.shippingschedulebList.length; a++) {
              let shiDetailItem = shiItem.shippingschedulebList[a];
              if (item.changeObjectId != shiDetailItem.poLineId) {
                continue;
              }
              for (let z = 0; z < shiResult.length; z++) {
                if (shiResult[z].poNumber != splits[0]) {
                  continue;
                }
                let shiDetail = shiResult[z].msgLineList;
                for (let k = 0; k < shiDetail.length; k++) {
                  if (shiDetailItem.poLineId != shiDetail[k].poLineId) {
                    continue;
                  }
                  let searchField = field;
                  if (shiMapping[field]) {
                    searchField = shiMapping[field];
                  }
                  let updateShiDetail = {};
                  updateShiDetail["id"] = shiDetailItem.id;
                  updateShiDetail[searchField] = shiDetail[k][field];
                  if (shiDetailItem.poCode) {
                    poCodes.push(shiDetailItem.poCode);
                  }
                  updateShiDetail["_status"] = "Update";
                  updateShiDetails.push(updateShiDetail);
                  mappings.push(shiDetailItem.orders_mapping);
                  orderMap.set(shiDetailItem.orders_mapping, { field: field, newValue: shiDetail[k][field] });
                  idsSet.add(shiItem.id);
                  let pushDetail = {};
                  pushDetail["orderChangeId"] = item.orderChangeId;
                  pushDetail["orderChangeDetailId"] = item.orderChangeDetailId;
                  pushDetail["demandOrder"] = item.orderHeaderNum;
                  pushDetail["orderChangeType"] = item.changeObjectType;
                  pushDetail["orderChangeTime"] = item.orderUpdateTime;
                  pushDetail["orderChangeStatus"] = item.orderChangeStatus;
                  pushDetail["batchNumber"] = item.batchNo;
                  pushDetail["groupId"] = shiItem.id;
                  pushDetail["demandLineId"] = shiDetailItem.poLineId;
                  pushDetail["changeClosedTime"] = item.changeClosedTime;
                  pushDetail["sourceId"] = item.sourceId;
                  pushDetail["orderChangeRemark"] = item.orderChangeRemark;
                  if (pushMapping[field]) {
                    pushDetail[pushMapping[field]] = shiDetail[k][field];
                  } else {
                    pushDetail[field] = shiDetail[k][field];
                  }
                  pushObjs.push(pushDetail);
                  //构建需要更新的要货计划变更指令的同步状态为2-已同步
                  updateOrderChangeObjs.push({ id: item.id, sysncStatus: "2", _status: "Update" });
                }
              }
            }
            if (updateShiDetails.length == 0) {
              continue;
            }
            shiUpdateObj.id = shiItem.id;
            shiUpdateObj.orderChangeId = item.orderChangeId;
            shiUpdateObj.orderChangeDetailId = item.orderChangeDetailId;
            shiUpdateObj.shippingschedulebList = updateShiDetails;
            updateShiObjs.push(shiUpdateObj);
          }
          let orderRes = [];
          if (mappings.length > 0) {
            let orderSql = "select id,extend71,status,bustype_code,currency.code,exchRate,exchRateType,invoiceVendor.code,natCurrency.code,org.code,vendor.code,vouchdate,";
            orderSql +=
              " (select inInvoiceOrg.code,inOrg.code,unit.code,purUOM.code as purUOM_Code,priceUOM.code as priceUOM_Code,product.cCode,taxitems.code,* from purchaseOrders) purchaseOrders from pu.purchaseorder.PurchaseOrder where purchaseOrders.extendOrdersMapping in ('" +
              mappings.join("','") +
              "') ";
            if (poCodes.length > 0) {
              orderSql += " and code in ('" + poCodes.join("','") + "')";
            }
            orderRes = ObjectStore.queryByYonQL(orderSql, "upu");
          }
          let finalUpdateShiObjs = [];
          // 采购订单是开立态的才更新要货计划
          orderRes.forEach((orderItem) => {
            updateShiObjs.forEach((updateShiObj) => {
              let finalUpdateShiObj = {};
              let finalShippingschduleb = [];
              if (updateShiObj.id == orderItem.extend71) {
                // 标记能与采购订单对上的要货计划，未生成采购订单的数据也应该更新处理
                updateShiObj.isOrder = "1";
                // 开立态
                if (orderItem.status == "0") {
                  updateShiObj.shippingschedulebList.forEach((shippingscheduleb) => {
                    finalShippingschduleb.push(shippingscheduleb);
                  });
                } else {
                  errorObjsMap.set(updateShiObj.orderChangeDetailId, { errorMsg: "采购订单不可变更\n", _status: "Update" });
                }
              }
              if (finalShippingschduleb.length > 0) {
                finalUpdateShiObj.id = updateShiObj.id;
                finalUpdateShiObj.orderChangeId = updateShiObj.orderChangeId;
                finalUpdateShiObj.orderChangeDetailId = updateShiObj.orderChangeDetailId;
                finalUpdateShiObj.shippingschedulebList = finalShippingschduleb;
                finalUpdateShiObjs.push(finalUpdateShiObj);
              }
              orderItem.extendChangeId = updateShiObj.orderChangeId;
              orderItem.extendChangeDetailId = updateShiObj.orderChangeDetailId;
            });
          });
          // 未生成采购订单的要货计划更新处理
          updateShiObjs.forEach((updateShiObj) => {
            if (!updateShiObj.isOrder) {
              // 未生成采购订单的要货计划
              finalUpdateShiObjs.push(updateShiObj);
            }
          });
          if (finalUpdateShiObjs.length > 0) {
            // 更新要货计划
            ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", finalUpdateShiObjs, "02a3de71");
          }
          let mappingField = {
            rpd: "recieveDate",
            country: "country",
            nodeNumber: ["priceQty", "qty", "subQty", "allQty", "oriRequestedQuantity"],
            oriRequestedQuantity: ["priceQty", "qty", "subQty", "allQty", "oriRequestedQuantity"],
            shipToLocation: "receiveAddress",
            shipToContact: "receiver",
            shipToContactPhone: "receiveTelePhone"
          };
          orderRes.forEach((orderItem) => {
            if (orderItem.status == "0") {
              let updateOrderObj = {};
              let purchaseOrders = [];
              orderItem.purchaseOrders.forEach((orderDetail) => {
                if (orderMap.has(orderDetail.extendOrdersMapping)) {
                  let orderMappObj = orderMap.get(orderDetail.extendOrdersMapping);
                  let orderField = mappingField[orderMappObj.field];
                  if (orderField) {
                    if (orderField instanceof Array) {
                      orderField.forEach((fieldItem) => {
                        orderDetail[fieldItem] = orderMappObj.newValue;
                      });
                    } else {
                      orderDetail[orderField] = orderMappObj.newValue;
                    }
                    orderDetail._status = "Update";
                    purchaseOrders.push(orderDetail);
                  }
                }
              });
              if (purchaseOrders.length > 0) {
                orderItem.resubmitCheckKey = uuid().replace(/-/g, "");
                orderItem._status = "Update";
                // 更新采购订单
                let orderUrl = config.configParams.newUrl + "/iuap-api-gateway/yonbip/scm/purchaseorder/singleSave_v1";
                let orderResponse = openLinker("POST", orderUrl, "PU", JSON.stringify({ data: orderItem }));
                orderResponse = JSON.parse(orderResponse);
                if (orderResponse.code != "200") {
                  // 更新采购订单失败，记录失败原因
                  let errObj = {};
                  if (!errorObjsMap.has(orderItem.extendChangeDetailId)) {
                    errObj = { errorMsg: orderResponse.message + "\n", _status: "Update" };
                  } else {
                    errObj = errorObjsMap.get(orderItem.extendChangeDetailId);
                    if (errObj.errorMsg) {
                      errObj.errorMsg += orderResponse.message + "\n";
                    } else {
                      errObj.errorMsg = orderResponse.message + "\n";
                    }
                  }
                  errorObjsMap.set(orderItem.extendChangeDetailId, errObj);
                }
              }
            }
          });
        });
      }
    });
    if (pushObjs.length > 0) {
      let pushBody = { data: pushObjs };
      let pushUrl = sconfig.BASE.HT_URL + sconfig.BASE.HT_URL_CHANGE;
      let times = getTime();
      let secret = SHA256Encode(times + sconfig.BASE.HT_TOKEN);
      let htHeader = { "Content-Type": "application/json", timestamp: times, ciphertext: secret };
      let exeHtRequestDate = getDate();
      let htResponse = postman("post", pushUrl, JSON.stringify(htHeader), JSON.stringify(pushBody));
      let htResponseObj = JSON.parse(htResponse);
      let exeHtResponseDate = getDate();
      // 记录日志
      try {
        let logHtObj = { methodName: "orderChange", requestParams: JSON.stringify(pushBody), requestTime: exeHtResponseDate, respResult: htResponse, respTime: exeHtResponseDate, url: pushUrl };
        var resHtLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logHtObj, "yb6b993e05");
      } catch (e) {}
      let responseStatus = htResponseObj.status + "";
      if (responseStatus.toLowerCase() != "success") {
        // 不更新状态，指令状态为新建
        let statusUpdateObjs = [];
        insertRes.forEach((changeIem) => {
          // 推送失败，状态改回新建
          statusUpdateObjs.push({ id: changeIem.id, integrateStatus: "1" });
        });
        ObjectStore.updateBatch("GT37595AT2.GT37595AT2.orderChangeInstructFinal", statusUpdateObjs, "yb93f23c80");
      }
    }
    let ids = Array.from(idsSet);
    if (ids.length > 0) {
      let pushFunc = extrequire("GT37595AT2.commonFun.commonPushHt");
      let push = pushFunc.execute(null, { ids: ids });
    }
    let errUpdates = [];
    errorObjsMap.forEach((value, key) => {
      let errSql = "select id from 	GT37595AT2.GT37595AT2.orderChangeInstructFinal where orderChangeDetailId = '" + key + "'";
      let errRes = ObjectStore.queryByYonQL(errSql);
      value.id = errRes[0].id;
      if (value.errorMsg.length > 199) {
        value.errorMsg = value.errorMsg.substring(0, 199);
      }
      errUpdates.push(value);
    });
    if (errUpdates.length > 0) {
      ObjectStore.updateBatch("GT37595AT2.GT37595AT2.orderChangeInstructFinal", errUpdates, "yb93f23c80");
    }
    if (updateOrderChangeObjs && updateOrderChangeObjs.length > 0) {
      var res = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.orderChangeInstructFinal", updateOrderChangeObjs, "yb93f23c80");
    }
    return { status: 0 };
    function getDate() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      var timeStr = date.getFullYear() + "-";
      if (date.getMonth() < 9) {
        // 月份从0开始的
        timeStr += "0";
      }
      timeStr += date.getMonth() + 1 + "-";
      timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      timeStr += " ";
      timeStr += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      timeStr += ":";
      timeStr += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      timeStr += ":";
      timeStr += date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return timeStr;
    }
    function getTime() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      return date.getTime();
    }
  }
}
exports({ entryPoint: MyTrigger });