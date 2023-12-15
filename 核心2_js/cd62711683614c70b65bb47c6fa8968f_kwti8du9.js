let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let Data = JSON.parse(request.data);
    console.log(JSON.stringify(Data));
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "保存";
    var headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 采购入库表体
    let param2 = { data: Data };
    let func = extrequire("ST.rule.publicInOrder");
    let orderData = func.execute(null, param2);
    console.log(JSON.stringify(orderData));
    // 页面状态
    let state = Data.hasOwnProperty("srcBillNO");
    if (state == true) {
      if (orderData.bustypeCode == "RK01") {
        let jsonBody = {
          outBizOrderCode: orderData.code,
          bizOrderType: "INBOUND",
          subBizOrderType: "CGRK",
          ownerCode: orderData.OrgCode,
          warehouseCode: orderData.warehouse_code,
          supplierCode: orderData.vendor_Code,
          supplierName: orderData.vendor_Name,
          channelCode: "DEFAULT",
          orderLines: orderData.SunList,
          orderSource: "PLATFORM_SYNC"
        };
        let body = {
          appCode: "beiwei-oms",
          appApiCode: "cgrk.di.bang.interface",
          schemeCode: "bw47",
          jsonBody: jsonBody
        };
        console.log(JSON.stringify(body));
        let header = { "Content-Type": "application/json;charset=UTF-8" };
        let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
        console.log(strResponse);
        let str = JSON.parse(strResponse);
        // 打印日志
        let LogBody = {
          data: { code: orderData.code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
        };
        let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(headers), JSON.stringify(LogBody));
        console.log(LogResponse);
        if (str.success != true) {
          throw new Error("调用OMS采购入库创建API失败：" + str.errorMessage);
        }
      } else {
        let fulfilOperations = new Array();
        let fulfilOperation = {};
        if (orderData.bWMS == false) {
          if (orderData.bustype_code == "A20001" || orderData.bustype_code == "CG02" || orderData.bustype_code == "CG03" || orderData.bustype_code == "CG06") {
            //正常采购
            fulfilOperation = {
              entryOrderCode: orderData.code,
              outBizOrderCode: orderData.code,
              omsOrderCode: orderData.srcBillNO,
              ownerCode: orderData.OrgCode,
              bizOrderType: "INBOUND",
              subBizOrderType: "CGRK",
              status: "INBOUND",
              warehouseCode: orderData.warehouse_code,
              finishTime: orderData.finishTime,
              operationOrderLines: orderData.SunList,
              confirmType: 0,
              systemType: "YS"
            };
            fulfilOperations.push(fulfilOperation);
            let body = {
              appCode: "beiwei-ys",
              schemeCode: "ys",
              appApiCode: "ys.cgrk.to.oms.confirm",
              jsonBody: { fulfilOperations }
            };
            console.log(JSON.stringify(body));
            let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
            console.log(strResponse);
            let str = JSON.parse(strResponse);
            // 打印日志
            let LogBody = {
              data: { code: orderData.code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
            };
            let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(headers), JSON.stringify(LogBody));
            console.log(LogResponse);
            if (str.success != true) {
              throw new Error("调用OMS采购入库确认创建API失败，失败原因：" + str.errorMessage);
            }
          } else if (orderData.bustype_code == "A20003" || orderData.bustype_code == "CG04" || orderData.bustype_code == "CG05") {
            //退供
            fulfilOperation = {
              entryOrderCode: orderData.code,
              outBizOrderCode: orderData.code,
              omsOrderCode: orderData.srcBillNO,
              ownerCode: orderData.OrgCode,
              bizOrderType: "OUTBOUND",
              subBizOrderType: "CGRK",
              status: "OUTBOUND",
              warehouseCode: orderData.warehouse_code,
              finishTime: orderData.finishTime,
              operationOrderLines: orderData.SunList,
              confirmType: 0,
              systemType: "YS"
            };
            fulfilOperations.push(fulfilOperation);
            let body = {
              appCode: "beiwei-ys",
              schemeCode: "ys",
              appApiCode: "ys.tgck.to.oms.confirm",
              jsonBody: { fulfilOperations }
            };
            console.log(JSON.stringify(body));
            let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
            console.log(strResponse);
            let str = JSON.parse(strResponse);
            // 打印日志
            let LogBody = {
              data: { code: orderData.code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
            };
            let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(headers), JSON.stringify(LogBody));
            console.log(LogResponse);
            if (str.success != true) {
              throw new Error("调用OMS采购入库确认创建API失败，失败原因：" + str.errorMessage);
            }
          }
        }
      }
    }
    function getOtherOutRecoeds(ids) {
      var object = {
        ids: ids,
        compositions: [
          {
            name: "purInRecords"
          }
        ]
      };
      return ObjectStore.selectBatchIds("st.purinrecord.PurInRecord", object);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });