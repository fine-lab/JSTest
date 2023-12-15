let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var tid = request.tid;
    var saleoutcode = request.saleoutcode;
    // 销售出库列表查询
    let body = { pageIndex: 1, pageSize: 10, code: saleoutcode };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SDOC", JSON.stringify(body));
    let api = JSON.parse(apiResponse);
    let messageCode = api.code;
    var ArrayList = new Array();
    var productData = {};
    var ArrList = new Array();
    var SunList = {};
    if (messageCode == "200") {
      let XSCKID = api.data.recordList[0].id;
      let func1 = extrequire("SDOC.API.token");
      let res = func1.execute(require);
      let token = res.access_token;
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      // 销售出库详情查询
      let apiResponse1 = postman("get", "https://www.example.com/" + token + "&id=" + XSCKID, JSON.stringify(headers), null);
      let api1 = JSON.parse(apiResponse1);
      let returnCode = api1.code;
      if (returnCode == "200") {
        let XSCKdata = api1.data;
        var OMSstate = XSCKdata["headDefine!define2"];
        if (OMSstate != "1" || OMSstate == undefined || OMSstate == null) {
          let warehouse = api1.data.warehouse;
          let warehouse_name = api1.data.warehouse_name;
          if (warehouse_name == "依安工厂电商仓") {
            let CKSql = "select code from 	aa.warehouse.Warehouse where id = '" + warehouse + "'";
            let CKRes = ObjectStore.queryByYonQL(CKSql, "productcenter");
            var warehouse_Code = CKRes[0].code;
            let vouchdate = api1.data.vouchdate;
            let invoiceOrg = api1.data.invoiceOrg;
            let details = api1.data.details;
            let iLogisticId = api1.data.iLogisticId;
            let WLSql = "select corp_code from aa.deliverycorp.Deliverycorp where id = '" + iLogisticId + "'";
            let WLRes = ObjectStore.queryByYonQL(WLSql, "productcenter");
            let corp_code = WLRes[0].corp_code;
            let iLogisticId_name = api1.data.iLogisticId_name;
            let cLogisticsBillNo = api1.data.cLogisticsBillNo;
            let ResReturn = postman("get", "https://www.example.com/" + token + "&id=" + invoiceOrg, JSON.stringify(headers), null);
            let Res = JSON.parse(ResReturn);
            let APICode = Res.code;
            if (APICode == "200") {
              // 交易原单查询
              var partParam = { tid: tid, pageIndex: 1, pageSize: 10, headselectfields: "tid", bodyselectfields: "oid,num,productID" };
              let JYYDQuery = { partParam: partParam };
              let urls = "https://www.example.com/";
              let APIResponse = openLinker("POST", urls, "SDOC", JSON.stringify(JYYDQuery));
              let popl = JSON.parse(APIResponse);
              let info = popl.data.info;
              let ownercode = Res.data.code;
              if (info.length > 0) {
                for (let j = 0; j < info.length; j++) {
                  let orderVouchDetail = info[j].orderVouchDetail;
                  if (orderVouchDetail.length > 0) {
                    var MessageList = new Array();
                    for (let t = 0; t < orderVouchDetail.length; t++) {
                      let oid = orderVouchDetail[t].oid;
                      let Tproduct = orderVouchDetail[t].productID;
                      let TNub = orderVouchDetail[t].num;
                      var logisticsInfodata = {
                        logisticsName: iLogisticId_name,
                        logisticsCode: corp_code,
                        shippingCode: [cLogisticsBillNo]
                      };
                      if (details.length > 0) {
                        for (let i = 0; i < details.length; i++) {
                          let priceQty = details[i].priceQty;
                          let productsku_cCode = details[i].productsku_cCode;
                          let product = details[i].product;
                          if (Tproduct == product && priceQty == TNub) {
                            let batchno = details[i].batchno;
                            var batch = {
                              batchCode: batchno,
                              batchQty: priceQty
                            };
                            var batchList = new Array();
                            batchList.push(batch);
                            productData = {
                              itemCode: productsku_cCode
                            };
                            ArrayList.push(productData);
                            SunList = {
                              orderLineNo: oid,
                              planQty: priceQty,
                              actualQty: priceQty,
                              inventoryType: "FX",
                              itemInfo: productData,
                              remark: "测试备注",
                              batchInfoList: batchList,
                              logisticsInfo: logisticsInfodata
                            };
                            ArrList.push(SunList);
                            break;
                          } else {
                            MessageList.push("原单商品或数量与出库单匹配不上！");
                          }
                        }
                      }
                    }
                    let jsonBody = {
                      outBizOrderCode: saleoutcode,
                      deliveryOrderTime: vouchdate,
                      deliveryOrderCode: tid,
                      bizOrderType: "OUTBOUND",
                      subBizOrderType: "XSCK",
                      ownerCode: ownercode,
                      warehouseCode: "YADS01",
                      orderLines: ArrList,
                      logisticsInfo: logisticsInfodata,
                      isFinish: 0,
                      status: "OUTBOUND"
                    };
                    let bodyes = {
                      appCode: "beiwei-oms",
                      appApiCode: "standard.sell.order.stockout.confirm",
                      schemeCode: "bw47",
                      jsonBody: jsonBody
                    };
                    let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(bodyes));
                    let str = JSON.parse(strResponse);
                    if (str.success != true) {
                      throw new Error("下推OMS出库单失败" + JSON.stringify(str));
                    } else {
                      let uuidStr = uuid();
                      let uuids = replace(uuidStr, "-", "");
                      let headDefine = {
                        id: XSCKID,
                        _status: "Update",
                        define2: true
                      };
                      let Data = { resubmitCheckKey: uuids, id: XSCKID, _status: "Update", headDefine: headDefine };
                      let Body = { data: Data };
                      let URL = "https://www.example.com/";
                      let ApiResponse = openLinker("POST", URL, "SDOC", JSON.stringify(Body));
                      let ApiState = JSON.parse(ApiResponse);
                      if (ApiState.code != "200") {
                        throw new Error("更新出库单状态失败！" + ApiState.message);
                      }
                    }
                  }
                }
              }
            }
          } else {
            throw new Error("该按钮只下发依安工厂电商仓其他仓库不下发！");
          }
        } else {
          throw new Error("已下推OMS出库单，无需重复下推");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });