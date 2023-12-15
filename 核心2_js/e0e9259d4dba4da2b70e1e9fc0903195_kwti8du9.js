let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    var tid = request.tid;
    var saleoutcode = request.saleoutcode;
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
    // 退换货查询
    let partParams = { tid: tid, pageIndex: 1, pageSize: 10, headselectfields: "tid", bodyselectfields: "oid,num,productID", headdefineselectfields: "define6", bodydefineselectfields: "define5" };
    let THHDQuery = { partParam: partParams };
    let THurls = URLData.URL + "/iuap-api-gateway/yonbip/sd/dst/refundorder/query";
    let THHAPIResponse = openLinker("POST", THurls, "SDOC", JSON.stringify(THHDQuery));
    let THHAP = JSON.parse(THHAPIResponse);
    // 表头OMS销退入库单号
    var mianNo = "";
    // 表体OMS销退入库单号
    var sunNo = "";
    if (THHAP.code == 200) {
      var lqa = THHAP.data.info[0].tradeOrderCustomItem;
      let mianNoState = lqa.hasOwnProperty("define6");
      if (mianNoState == true) {
        mianNo = lqa.define6;
      }
      var lais = THHAP.data.info[0].tradeOrderDetail[0].tradeOrderDetailCustomItem;
      let sunNoState = lais.hasOwnProperty("define5");
      if (sunNoState == true) {
        sunNo = lais.define5;
      }
    }
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
        var OMSstate = XSCKdata["headDefine!define2"];
        if (OMSstate != "1" || OMSstate == undefined || OMSstate == null) {
          let warehouse = api1.data.warehouse;
          let warehouse_name = api1.data.warehouse_name;
          let CKSql = "select code from 	aa.warehouse.Warehouse where id = '" + warehouse + "'";
          let CKRes = ObjectStore.queryByYonQL(CKSql, "productcenter");
          var warehouse_Code = CKRes[0].code;
          let vouchdate = api1.data.vouchdate;
          let invoiceOrg = api1.data.invoiceOrg;
          let details = api1.data.details;
          let iLogisticId = api1.data.iLogisticId;
          let iLogisticId_name = "";
          // 判断快递公司是否存在
          let state = api1.data.hasOwnProperty("headDefine!define3");
          if (state == true) {
            iLogisticId_name = api1.data["headDefine!define3"];
          }
          let cLogisticsBillNo = api1.data.cLogisticsBillNo;
          let ResReturn = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/orgunit/detail?access_token=" + token + "&id=" + invoiceOrg, JSON.stringify(headers), null);
          let Res = JSON.parse(ResReturn);
          let APICode = Res.code;
          if (APICode == "200") {
            var partParam = { tid: tid, pageIndex: 1, pageSize: 10, headselectfields: "tid", bodyselectfields: "oid,num,productID" };
            let JYYDQuery = { partParam: partParam };
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
                    let Tproduct = orderVouchDetail[t].productID;
                    let TNub = orderVouchDetail[t].num;
                    var logisticsInfodata = {
                      logisticsName: iLogisticId_name,
                      logisticsCode: "",
                      shippingCode: [cLogisticsBillNo]
                    };
                    if (details.length > 0) {
                      for (let i = 0; i < details.length; i++) {
                        let priceQty = details[i].priceQty;
                        let productsku_cCode = details[i].productsku_cCode;
                        let product = details[i].product;
                        if (Tproduct == product && priceQty == TNub * -1) {
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
                            orderLineNo: sunNo,
                            planQty: priceQty,
                            actualQty: priceQty,
                            inventoryType: "FX",
                            itemInfo: productData,
                            remark: "",
                            batchInfoList: batchList,
                            logisticsInfo: logisticsInfodata
                          };
                          ArrList.push(SunList);
                          break;
                        }
                      }
                    }
                  }
                  let jsonBody = {
                    outBizOrderCode: saleoutcode,
                    deliveryOrderTime: vouchdate,
                    deliveryOrderCode: mianNo,
                    bizOrderType: "XTRK",
                    subBizOrderType: "XSCK",
                    ownerCode: ownercode,
                    warehouseCode: "YADS01",
                    orderLines: ArrList,
                    logisticsInfo: logisticsInfodata,
                    isFinish: 0,
                    status: "INBOUND"
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
                    let URL = URLData.URL + "/iuap-api-gateway/yonbip/scm/salesout/single/update";
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
          throw new Error("已下推OMS出库单，无需重复下推");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });