let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.sendDataTosourcePO.data;
    let func1 = extrequire("GT101792AT1.common.sendWMS");
    let method = "";
    let WmsBody = new Object();
    //正式环境需要切换
    if (data.busType == "1471570368221675524") {
      //包材采购到货
      method = "putASN";
      let func2 = extrequire("PU.cg001.getRkBody");
      WmsBody = func2.execute(null, data);
    } else if (data.busType == "1481745515210604554") {
      method = "putSalesOrder";
      //包材采购退货
      let funcPurchase = extrequire("PU.cg001.getPurchase");
      let purchaseBody = funcPurchase.execute(null, data.id);
      let func3 = extrequire("PU.cg001.getCkBody");
      WmsBody = func3.execute(null, purchaseBody.body);
    }
  }
}
exports({ entryPoint: MyTrigger });