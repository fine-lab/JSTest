let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param;
    // 获取token
    let GetTokenUrl = extrequire("ST.rule.publicToken");
    let GetToken = GetTokenUrl.execute(null, null);
    let salesOrder = postman("get", "https://www.example.com/" + GetToken.token + "&id=" + id, JSON.stringify(GetToken.headers), null);
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