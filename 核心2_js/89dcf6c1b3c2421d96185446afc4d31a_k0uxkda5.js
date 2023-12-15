let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let realModelData = param.realModelData;
    let request = JSON.parse(param.requestData);
    for (var ji = 0; ji < realModelData.length; ji++) {
      if (realModelData[ji].salesOrgId == "1556733659914960925" || realModelData[ji].salesOrgId == "1556733659914960919") {
        let orderDetails = realModelData[ji].orderDetails;
        let detailsmap = new Map(); //发货仓库map集合
        let stockOrgmap = new Map();
        for (var m = 0; m < orderDetails.length; m++) {
          detailsmap.set(orderDetails[m].stockId, orderDetails[m].stockName);
          if (orderDetails[m].stockId == undefined || orderDetails[m].stockId == "") {
            continue;
          } else {
            stockOrgmap.set(orderDetails[m].stockId, orderDetails[m].stockOrgId);
          }
        }
        if (stockOrgmap.size != 0) {
          for (let key of stockOrgmap.keys()) {
            let details = new Array();
            let contents = new Array();
            //其他入库单子表
            let othInRecords = new Array();
            let urlx = "https://www.example.com/";
            let stockUrl = "https://www.example.com/";
            let urls = "https://www.example.com/";
            let updateSaleurl = "https://www.example.com/";
            let bigStockId = "";
            let phone = "";
            let definesInfo = new Array();
            for (let i = 0; i < orderDetails.length; i++) {
              let defines = "";
              if (orderDetails[i].stockId == key) {
                //调用可用量查询
                //仓库id、物料id  查可用量
                let bodyx = {
                  warehouse: orderDetails[i].stockId,
                  product: orderDetails[i].productId
                };
                let apiStockResponses = openLinker("POST", urlx, "SCMSA", JSON.stringify(bodyx));
                let data = JSON.parse(apiStockResponses).data;
                //查可用量
                let availableqty = 0;
                if (data != null && data != "") {
                  //计算可用量
                  for (var j = 0; j < data.length; j++) {
                    availableqty = availableqty + data[j].availableqty;
                  }
                }
                //查询安全库存
                let sql =
                  "select * from 	AT16560C6C08780007.AT16560C6C08780007.aqkcbd where cangku = '" +
                  orderDetails[i].stockId +
                  "' and wuliao = " +
                  orderDetails[i].productId +
                  " and org = " +
                  realModelData[ji].salesOrgId;
                var res3 = ObjectStore.queryByYonQL(sql, "developplatform");
                let xiaxiananquankucun = 0;
                let shangxiananquankucun = 0;
                if (res3.length > 0) {
                  //下限库存
                  xiaxiananquankucun = res3[0].xiaxiananquankucun;
                  //上限库存
                  shangxiananquankucun = res3[0].shangxiananquankucun;
                  //判断是否需要调货
                  if (orderDetails[i].qty > availableqty - xiaxiananquankucun) {
                    //需要转库的数量
                    let qty = orderDetails[i].qty + shangxiananquankucun - availableqty;
                    let detail = {
                      product: orderDetails[i].productId,
                      productsku: orderDetails[i].skuId,
                      qty: qty,
                      unit: orderDetails[i].masterUnitId,
                      invExchRate: "1",
                      subQty: qty,
                      stockUnitId: orderDetails[i].masterUnitId,
                      _status: "Insert"
                    };
                    defines = {
                      isHead: false,
                      isFree: true,
                      detailIds: orderDetails[i].id
                    };
                    let content = "商品" + orderDetails[i].productName + "需转库数量：" + qty;
                    contents.push(content);
                    details.push(detail);
                    definesInfo.push(defines);
                    //查询物料对应的【商品结算类型】,如果为：代售结算商品则需生成"其他入库单"
                    let queryDefine = "select define4 from pc.product.ProductFreeDefine where id='" + orderDetails[i].productId + "'";
                    var defineRes = ObjectStore.queryByYonQL(queryDefine, "productcenter");
                    if (defineRes.length > 0 && defineRes[0].define4 == "代售结算商品") {
                      let newDetail = {
                        product: orderDetails[i].productId,
                        productsku: orderDetails[i].skuId,
                        qty: orderDetails[i].qty,
                        unit: orderDetails[i].masterUnitId,
                        invExchRate: "1",
                        subQty: orderDetails[i].qty,
                        stockUnitId: orderDetails[i].masterUnitId,
                        unitExchangeType: "0",
                        _status: "Insert"
                      };
                      othInRecords.push(newDetail);
                    }
                  }
                } else {
                  throw new Error("【销售组织】：" + request.salesOrgId_name + "【仓库】：" + orderDetails[i].stockName + "【物料】：" + orderDetails[i].productName + "没有维护安全库存");
                }
              }
            }
            //生成转库单
            if (details.length > 0) {
              let orgList = new Array();
              orgList.push(stockOrgmap.get(key));
              let stockBodys = {
                pageSize: 50,
                pageIndex: 1,
                iUsed: "enable",
                org: orgList
              };
              let apiStockResponsex = openLinker("POST", stockUrl, "SCMSA", JSON.stringify(stockBodys));
              apiStockResponsex = JSON.parse(apiStockResponsex);
              let phone = "";
              if (apiStockResponsex.code == "200") {
                let stockList = apiStockResponsex.data.recordList;
                if (stockList.length > 0) {
                  for (var k = 0; k < stockList.length; k++) {
                    let stock = stockList[k];
                    if (includes(stock.code, "G")) {
                      bigStockId = stock.id;
                      phone = stock.phone;
                    }
                  }
                } else {
                  throw new Error("【仓库】：" + stockName + "无对应的供应商仓库");
                }
              }
              if (bigStockId == "") {
                throw new Error("【仓库】：" + stockName + "无对应的供应商仓库");
              }
              let param = extrequire("SCMSA.backDesignerFunction.dateNow");
              let dateNow = param.execute();
              let date = dateNow.date;
              let bodys = {
                data: {
                  org: stockOrgmap.get(key),
                  vouchdate: date,
                  businesstype: "A11001",
                  outWarehouse: bigStockId,
                  inWarehouse: key,
                  _status: "Insert",
                  details: details,
                  defines: {
                    define2: realModelData[ji].salesOrgId,
                    define2_name: request.salesOrgId_name,
                    define1: realModelData[ji].code,
                    _status: "Insert"
                  }
                }
              };
              let apiResponses = openLinker("POST", urls, "SCMSA", JSON.stringify(bodys));
              let jsonresult = JSON.parse(apiResponses);
              let zkdata = jsonresult.data;
              if (jsonresult.code == "200") {
                let infos = zkdata.infos;
                let failCount = parseInt(zkdata.failCount);
                //销售订单反写
                for (var i = 0; i < definesInfo.length; i++) {
                  definesInfo[i].define1 = infos[0].code;
                }
                let updateSaleBody = {
                  billnum: "voucher_order",
                  datas: [
                    {
                      id: realModelData[ji].id,
                      code: realModelData[ji].code,
                      definesInfo: definesInfo
                    }
                  ]
                };
                let updateSaleResponse = openLinker("POST", updateSaleurl, "SCMSA", JSON.stringify(updateSaleBody));
                updateSaleResponse = JSON.parse(updateSaleResponse);
                if (updateSaleResponse.code == "200") {
                  //当手机号存在的情况下发送预警消息
                  if (phone != null && phone != "") {
                    //根据手机号查询用户
                    let urlPhone = "https://www.example.com/";
                    let bodyPhone = {
                      index: "1",
                      size: "10",
                      searchcode: phone
                    };
                    let apiResponsePhone = openLinker("POST", urlPhone, "SCMSA", JSON.stringify(bodyPhone));
                    var apiResponsePho = JSON.parse(apiResponsePhone);
                    //用户不为空的情况下发送预警
                    if (apiResponsePho.data.content.length != 0) {
                      let userId = apiResponsePho.data.content[0].userId;
                      let yhtUserIds = new Array();
                      yhtUserIds.push(userId);
                      let urlYu = "https://www.example.com/";
                      let bodyYu = {
                        yhtUserIds: yhtUserIds,
                        title: "仓库" + stockName + "需要补货" + "转库单:" + infos[0].code,
                        content: contents.toString(),
                        srcMsgId: uuid() //幂等校验
                      };
                      let apiResponseYu = openLinker("POST", urlYu, "SCMSA", JSON.stringify(bodyYu));
                    } else {
                      throw new Error("该手机号下没有用户");
                    }
                  }
                } else {
                  throw new Error(updateSaleResponse.message);
                }
              } else {
                throw new Error(jsonresult.message);
              }
            }
            //生成其他入库单  交易类型【普通销售曼兹】
            if (othInRecords.length > 0 && realModelData[ji].transactionTypeId == "1625072851639861255") {
              //当前日期
              let param = extrequire("SCMSA.backDesignerFunction.dateNow");
              let dateNow = param.execute();
              let date = dateNow.date;
              //查询库存仓库
              let queryWarehouseSql = "select id from aa.warehouse.Warehouse where org='" + stockOrgmap.get(key) + "' and iUsed='enable' and code like 'G'";
              var warehouseRes = ObjectStore.queryByYonQL(queryWarehouseSql, "productcenter");
              if (warehouseRes.length == 0) {
                throw new Error("【仓库】：" + detailsmap.get(key) + "无对应的供应商仓库");
              }
              let resubmitCheckKey = replace(uuid(), "-", "");
              //其他入库单实体
              let savebodys = {
                data: {
                  resubmitCheckKey: resubmitCheckKey,
                  org: stockOrgmap.get(key),
                  accountOrg: stockOrgmap.get(key),
                  vouchdate: date,
                  bustype: "A08001",
                  warehouse: warehouseRes[0].id,
                  _status: "Insert",
                  othInRecords: othInRecords,
                  defines: {
                    define2: realModelData[ji].salesOrgId,
                    define2_name: request.salesOrgId_name,
                    define1: realModelData[ji].code,
                    _status: "Insert"
                  }
                }
              };
              let singleSaveUrl = "https://www.example.com/";
              let singleSaveResponses = openLinker("POST", singleSaveUrl, "SCMSA", JSON.stringify(savebodys));
              let singleSaveResult = JSON.parse(singleSaveResponses);
              let savedata = singleSaveResult.data;
              if (singleSaveResult.code == "200") {
                let aduitArray = new Array();
                let aduObj = { id: savedata.id };
                aduitArray.push(aduObj);
                let aduitBody = {
                  data: aduitArray
                };
                let singleAduitUrl = "https://www.example.com/";
                let singleAduitResponses = openLinker("POST", singleAduitUrl, "SCMSA", JSON.stringify(aduitBody));
                let singleAduitResult = JSON.parse(singleAduitResponses);
                if (singleAduitResult.code == "200") {
                  let aduitfailCount = singleAduitResult.data.failCount;
                  if (aduitfailCount > 0) {
                    throw new Error("其他入库单审核异常：" + singleAduitResult.data.failInfos[0]);
                  }
                } else {
                  throw new Error("其他入库单审核异常：" + singleAduitResult.message);
                }
              } else {
                throw new Error("生成其他入库单异常：" + singleSaveResult.message);
              }
            }
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });