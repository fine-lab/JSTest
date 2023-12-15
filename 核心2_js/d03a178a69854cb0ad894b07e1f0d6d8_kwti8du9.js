let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    var id = param;
    // 获取token
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    let salesOrder = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/sd/voucherorder/detail?access_token=" + token + "&id=" + id, JSON.stringify(headers), null);
    let salesOrderList = JSON.parse(salesOrder);
    if (salesOrderList.code == "200") {
      var Data = salesOrderList.data.headFreeItem;
      var transaction = salesOrderList.data.transactionTypeId;
      return { code: salesOrderList.code, transaction: transaction };
    } else {
      return { code: salesOrderList.code, message: salesOrderList.message };
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });