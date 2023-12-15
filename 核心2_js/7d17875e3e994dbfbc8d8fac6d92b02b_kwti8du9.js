let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.convBills[0];
    if (data.orgId == "2522102344422656" || data.orgId == "2390178757465088") {
      let Body = {};
      let func3 = extrequire("PO.backDesignerFunction.getProductData");
      let arrivalOrders = data.finishedReportDetail;
      let res3 = func3.execute(null, arrivalOrders[0].sourceid);
      let jsonData = res3.jsonData.data;
      let func1 = extrequire("GT101792AT1.common.sendRgGd");
      if (data.orgId == "2522102344422656") {
        //依安工厂
        Body.warehouseId = "yourIdHere";
        Body.customerId = "yourIdHere";
      } else if (data.orgId == "2390178757465088") {
        //克东
        Body.warehouseId = "yourIdHere";
        Body.customerId = "yourIdHere";
      }
      Body.asnType = jsonData.transTypeCode;
      Body.docNo = data.code;
      let method = "CANCEL_ASN";
      let wmsBody = {
        data: {
          ordernos: Body
        }
      };
      let param = {
        data: wmsBody,
        method: method
      };
      let res = func1.execute(null, param);
      let sendWMSResult = res.jsonResponse;
      let Response = sendWMSResult.Response.return;
      if (Response.returnCode != "0000") {
        throw new Error("YS完工报告弃审调用WMS【入库单改单接口】异常：" + JSON.stringify(Response.returnDesc));
      } else if (Response.returnFlag != "1") {
        throw new Error("YS完工报告弃审调用WMS【入库单改单接口】失败：returnFlag为" + JSON.stringify(Response.returnFlag) + ",此数据不可修改!");
      }
    }
  }
}
exports({ entryPoint: MyTrigger });