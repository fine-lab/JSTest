let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    var ctrantypeid = pdata.transactionTypeId;
    //保证金比例
    var bzjbl = pdata.orderDefineCharacter.attrext9;
    if (ctrantypeid == "1571632360282128386" || ctrantypeid == "1571632961580695558") {
      if (bzjbl == null || bzjbl == "" || bzjbl == {}) {
        throw new Error("保证金比例不能为空");
      }
    }
    var bb = "headFreeItem!define3"; //定金比例
    var djbl = pdata.orderDefineCharacter.attrext3;
    if (ctrantypeid == "1571632179915522057" || ctrantypeid == "1571632849913118729") {
      if (djbl == null || djbl == "" || djbl == {}) {
        throw new Error("定金比例不能为空");
      }
    }
    var bb = "headFreeItem!define5"; //送货地址
    var shdz = pdata.orderDefineCharacter.attrext5;
    if (shdz != null && shdz.length > 100) {
      throw new Error("送货地址长度超过100");
    }
    if (ctrantypeid == "1571632566464675845" || ctrantypeid == "1571632738268086275" || ctrantypeid == "1571632738268086275" || ctrantypeid == "1571632961580695558") {
      var bodys = pdata.orderDetails;
      for (var i = 0; i < bodys.length; i++) {
        var taxRate = bodys[i].taxRate;
        if (taxRate > 0) {
          throw new Error("外贸订单税率不能大于0");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });