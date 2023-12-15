let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    var tid = request.tid;
    var saleoutcode = request.saleoutcode;
    var OrderID = request.ID;
    // 发货明细查询
    let OrderSql = "select iquantity,product from ec.ec_tradeorder.ECShipDetail where parentid = '" + OrderID + "'";
    var OrderRes = ObjectStore.queryByYonQL(OrderSql, "dst");
    // 销售出库列表查询
    let body = { pageIndex: 1, pageSize: 10, code: saleoutcode };
    let url = URLData.URL + "/iuap-api-gateway/yonbip/scm/salesout/list";
    let apiResponse = openLinker("POST", url, "SDOC", JSON.stringify(body));
    let api = JSON.parse(apiResponse);
    let messageCode = api.code;
    var ArrayList = new Array();
    var productData = {};
    var ArrList = new Array();
    var SunList = {};
    if (messageCode == "200") {
      let XSCKID = api.data.recordList[0].id;
      let func1 = extrequire("SDOC.API.getToken");
      let res = func1.execute(require);
      let token = res.access_token;
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      // 销售出库详情查询
      let apiResponse1 = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/scm/salesout/detail?access_token=" + token + "&id=" + XSCKID, JSON.stringify(headers), null);
      let api1 = JSON.parse(apiResponse1);
      let returnCode = api1.code;
      if (returnCode == "200") {
        let XSCKdata = api1.data;
        var OMSstate = XSCKdata["headDefine!define11"];
        let warehouse = api1.data.warehouse;
        let CKSql = "select code from 	aa.warehouse.Warehouse where id = '" + warehouse + "'";
        let CKRes = ObjectStore.queryByYonQL(CKSql, "productcenter");
        var warehouse_Code = CKRes[0].code;
        let warehouse_name = api1.data.warehouse_name;
        if (
          warehouse_Code != "YA01" &&
          warehouse_Code != "KD03" &&
          warehouse_Code != "KD04" &&
          warehouse_Code != "KD05" &&
          warehouse_Code != "KD06" &&
          warehouse_Code != "KD07" &&
          warehouse_Code != "KD08" &&
          warehouse_Code != "KD40" &&
          warehouse_Code != "KD50" &&
          warehouse_Code != "YA02" &&
          warehouse_Code != "YA03" &&
          warehouse_Code != "YA04" &&
          warehouse_Code != "YA05" &&
          warehouse_Code != "YA06" &&
          warehouse_Code != "YA07" &&
          warehouse_Code != "YA08" &&
          warehouse_Code != "YA09" &&
          warehouse_Code != "YA10" &&
          warehouse_Code != "YASDBCP" &&
          warehouse_Code != "YASDBCPBF" &&
          warehouse_Code != "KD05" &&
          warehouse_Code != "YASDBCPBHG" &&
          warehouse_Code != "YASDBCPGK" &&
          warehouse_Code != "YASDCP" &&
          warehouse_Code != "YASDCPBF" &&
          warehouse_Code != "YASDCPBHG" &&
          warehouse_Code != "YASDCPGK" &&
          warehouse_Code != "YAZKBCP" &&
          warehouse_Code != "YAZKBCPBF" &&
          warehouse_Code != "YAZKBCPBHG" &&
          warehouse_Code != "YAZKBCPGK" &&
          warehouse_Code != "YAZKCP" &&
          warehouse_Code != "YAZKCPBF" &&
          warehouse_Code != "YAZKCPBHG" &&
          warehouse_Code != "YAZKCPGK" &&
          warehouse_Code != "SZC-BHG" &&
          warehouse_Code != "SZC"
        ) {
          let vouchdate = api1.data.vouchdate;
          let invoiceOrg = api1.data.invoiceOrg;
          let details = api1.data.details;
          let iLogisticId = api1.data.iLogisticId;
          let wlsql = "select corp_code from 	aa.deliverycorp.Deliverycorp where id = '" + iLogisticId + "'";
          let wlres = ObjectStore.queryByYonQL(wlsql, "productcenter");
          let iLogisticId_code = capitalizeEveryWord(wlres[0].corp_code);
          let iLogisticId_name = api1.data.iLogisticId_name;
          let cLogisticsBillNo = api1.data.cLogisticsBillNo;
          let ResReturn = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/orgunit/detail?access_token=" + token + "&id=" + invoiceOrg, JSON.stringify(headers), null);
          let Res = JSON.parse(ResReturn);
          let APICode = Res.code;
          if (APICode == "200") {
            var partParam = { tid: tid, pageIndex: 1, pageSize: 10, headselectfields: "tid", bodyselectfields: "oid,num,productID" };
            let JYYDQuery = { partParam: partParam };
            // 交易原单查询
            let urls = URLData.URL + "/iuap-api-gateway/yonbip/sd/dst/tradevouch/query";
            let APIResponse = openLinker("POST", urls, "SDOC", JSON.stringify(JYYDQuery));
            let popl = JSON.parse(APIResponse);
            let info = popl.data.info;
            let ownercode = Res.data.code;
            if (info.length > 0) {
              for (let j = 0; j < info.length; j++) {
                let orderVouchDetail = info[j].orderVouchDetail;
                if (orderVouchDetail.length > 0) {
                  for (let t = 0; t < orderVouchDetail.length; t++) {
                    let oid = orderVouchDetail[t].oid;
                    var logisticsInfoData = {
                      deliveryMode: "2C",
                      logisticsCode: iLogisticId_code,
                      logisticsName: iLogisticId_name,
                      driverName: iLogisticId_name,
                      shippingCode: [cLogisticsBillNo]
                    };
                    var qtyMap = new Map();
                    var orderMap = new Map();
                    if (details.length > 0) {
                      for (let o = 0; o < details.length; o++) {
                        let productID = details[o].product;
                        let FHQty = details[o].subQty;
                        if (undefined != orderMap.get(productID) && null != orderMap.get(productID)) {
                          orderMap.set(productID, details[o]);
                          let OldQty = qtyMap.get(productID);
                          qtyMap.set(productID, OldQty + FHQty);
                        } else {
                          orderMap.set(productID, details[o]);
                          qtyMap.set(productID, FHQty);
                        }
                      }
                    }
                    if (details.length > 0) {
                      var batchList = new Array();
                      for (let key of orderMap.keys()) {
                        for (let i = 0; i < details.length; i++) {
                          if (details[i].product == orderMap.get(key).product) {
                            let batchno = details[i].batchno;
                            let productDate = details[i].producedate;
                            let expireDate = details[i].invaliddate;
                            var batch = {
                              batchCode: batchno,
                              inventoryType: "02",
                              batchQty: details[i].subQty,
                              productDate: productDate,
                              expireDate: expireDate
                            };
                            batchList.push(batch);
                          }
                        }
                        productData = {
                          itemCode: orderMap.get(key).productsku_cCode
                        };
                        ArrayList.push(productData);
                        SunList = {
                          orderLineNo: oid,
                          planQty: qtyMap.get(key),
                          actualQty: qtyMap.get(key),
                          inventoryType: "02",
                          status: "OUTBOUND",
                          itemInfo: productData,
                          remark: "",
                          batchInfoList: batchList,
                          logisticsInfo: {}
                        };
                        ArrList.push(SunList);
                      }
                    }
                  }
                  let jsonBody = {
                    outBizOrderCode: saleoutcode,
                    deliveryOrderTime: vouchdate,
                    deliveryOrderCode: tid,
                    bizOrderType: "OUTBOUND",
                    subBizOrderType: "XSCK",
                    ownerCode: "001",
                    warehouseCode: warehouse_Code,
                    orderLines: ArrList,
                    logisticsInfo: logisticsInfoData,
                    isFinish: 0,
                    status: "OUTBOUND"
                  };
                  let bodyes = {
                    appCode: "beiwei-oms",
                    appApiCode: "standard.sell.order.stockout.confirm",
                    schemeCode: "bw47",
                    jsonBody: jsonBody
                  };
                  let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(bodyes));
                  let str = JSON.parse(strResponse);
                  if (str.success != true) {
                    throw new Error("下推OMS出库单失败!" + JSON.stringify(str.errorMessage));
                  } else {
                    let uuidStr = uuid();
                    let uuids = replace(uuidStr, "-", "");
                    let headDefine = {
                      id: XSCKID,
                      _status: "Update",
                      define11: true
                    };
                    let Data = { resubmitCheckKey: uuids, id: XSCKID, _status: "Update", headDefine: headDefine };
                    let Body = { data: Data };
                    let URL = URLData.URL + "/iuap-api-gateway/yonbip/scm/salesout/single/update";
                    let ApiResponse = openLinker("POST", URL, "SDOC", JSON.stringify(Body));
                    let ApiState = JSON.parse(ApiResponse);
                    if (ApiState.code != "200") {
                      throw new Error("更新出库单状态失败！原因是：" + ApiState.message);
                    }
                  }
                }
              }
            }
          }
        } else {
          throw new Error("所选仓库无需下推OMS！");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });