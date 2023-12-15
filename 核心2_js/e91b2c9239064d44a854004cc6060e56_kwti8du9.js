let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let sendDataTosourcePO = param.sendDataToFi;
    if (typeof sendDataTosourcePO != "undefined") {
      let data = sendDataTosourcePO.data;
      let func1 = extrequire("GT101792AT1.common.sendWMS");
      let method = "";
      let WmsBody = new Object();
      //正式环境需要切换
      if (data.inInvoiceOrg == "2390178757465088" || data.inInvoiceOrg == "2369205391741184" || data.inInvoiceOrg == "2522102344422656") {
        if (data.busType == "1501321452140888070" || data.busType == "1511376485992628230") {
          //包材采购到货、外采成品、半成品
          method = "putASN";
          let func2 = extrequire("PU.cg001.getRkBody");
          WmsBody = func2.execute(null, data);
        } else if (data.busType == "1501340049359765512" || data.busType == "1514360680802156551") {
          method = "putSalesOrder";
          //包材采购退货
          let funcPurchase = extrequire("PU.cg001.getPurchase");
          let purchaseBody = funcPurchase.execute(null, data.id);
          let func3 = extrequire("PU.cg001.getCkBody");
          WmsBody = func3.execute(null, purchaseBody.body);
        }
        if (method != "" && WmsBody != null) {
          let param = {
            data: WmsBody.body,
            method: method
          };
          let res = func1.execute(null, param);
          let sendWMSResult = res.jsonResponse;
          let Response = sendWMSResult.Response.return;
          if (Response.returnCode != "0000") {
            throw new Error("YS采购到货/退货推WMS异常：" + JSON.stringify(Response.returnDesc));
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });