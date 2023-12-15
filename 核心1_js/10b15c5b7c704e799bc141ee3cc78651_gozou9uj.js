let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取接口配置信息
    let configFunc = extrequire("GT37595AT2.commonFun.configParamsFun");
    let config = configFunc.execute("", null);
    let sconfigFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let sconfig = sconfigFunc.execute();
    let header = {
      "Content-Type": "application/json",
      "X-HW-ID": sconfig.BASE.X_HW_ID,
      "X-HW-APPKEY": sconfig.BASE.X_HW_APPKEY
    };
    let ids = request.ids;
    let poNumbers = request.poNumbers;
    //查询内容
    var condition = { ids: ids };
    //实体查询
    var orderChangeResutData = ObjectStore.selectBatchIds("GT37595AT2.GT37595AT2.orderChangeInstructFinal", condition);
    if (!orderChangeResutData || orderChangeResutData.length == 0) {
      return { status: 1 };
    }
    let changeMap = new Map(); // 存放同一需求号+批次号的数据
    for (let i = 0; i < orderChangeResutData.length; i++) {
      let orderChangeObj = orderChangeResutData[i];
      let mapKey = orderChangeObj.orderHeaderNum + "_" + orderChangeObj.changeObjectId;
      if (changeMap.has(mapKey)) {
        let exitObjs = changeMap.get(mapKey);
        exitObjs.push(orderChangeObj);
        changeMap.set(mapKey, exitObjs);
      } else {
        changeMap.set(mapKey, [orderChangeObj]);
      }
    }
    let exeShiRequestDate = getDate();
    let shitUrl = sconfig.BASE.URL + "/api/service/esupplier/findCpoResult/1.0.0?suffix_path=/100/1";
    let shiBody = { vendorCode: sconfig.BASE.SUPPLIER_CODE, poNumberList: poNumbers };
    let shiApiResponse = postman("post", shitUrl, JSON.stringify(header), JSON.stringify(shiBody));
    let exeShiResponseDate = getDate();
    let resShiData = JSON.parse(shiApiResponse);
    // 记录日志
    try {
      let logObj = {
        methodName: "findCpoResult",
        requestParams: JSON.stringify(shiBody),
        requestTime: exeShiRequestDate,
        respResult: shiApiResponse,
        respTime: exeShiResponseDate,
        url: shitUrl
      };
      var resLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
    } catch (e) {}
    if (!resShiData || !resShiData.result) {
      // 接口没有数据，直接返回
      return { status: 1 };
    }
    let shiResult = resShiData.result;
    let pushObjs = []; // 推送供应商的变更指令对象
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
        "' and shippingschedulebList.poLineId = '" +
        splits[1] +
        "'";
      let searchRes = ObjectStore.queryByYonQL(searchSql);
      if (searchRes && searchRes.length > 0) {
        value.forEach((item) => {
          let field = item.changeField;
          if (field) {
            field = field.replace(" ", "").replace("order_fulsch_demand_header_t:", "").replace("order_fulsch_demand_line_t:", "");
          }
          if (fieldSMapping[field]) {
            field = fieldSMapping[field];
          }
          for (let j = 0; j < searchRes.length; j++) {
            let shiItem = searchRes[j];
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
                  pushDetail["newValue"] = item.newOfValue;
                  pushDetail["changeFieldDesc"] = item.changeFieldDesc;
                  pushDetail["oldValue"] = item.oldValue;
                  pushDetail["changeField"] = item.changeField;
                  if (pushMapping[field]) {
                    pushDetail[pushMapping[field]] = shiDetail[k][field];
                  } else {
                    pushDetail[field] = shiDetail[k][field];
                  }
                  pushObjs.push(pushDetail);
                }
              }
            }
          }
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
        let logHtObj = {
          methodName: "orderChange",
          requestParams: JSON.stringify(pushBody),
          requestTime: exeHtResponseDate,
          respResult: htResponse,
          respTime: exeHtResponseDate,
          url: pushUrl
        };
        var resHtLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logHtObj, "yb6b993e05");
      } catch (e) {}
      let responseStatus = htResponseObj.status + "";
      if (responseStatus.toLowerCase() != "success") {
        // 不更新状态，指令状态为新建
        let statusUpdateObjs = [];
      }
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
exports({ entryPoint: MyAPIHandler });