let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param;
    // 获取token
    let GetTokenUrl = extrequire("ST.rule.publicToken");
    let GetToken = GetTokenUrl.execute(null, null);
    let OrderGoods = postman(
      "get",
      "https://www.example.com/" + GetToken.token + "&id=" + id,
      JSON.stringify(GetToken.headers),
      null
    );
    let OrderGoodsList = JSON.parse(OrderGoods);
    if (OrderGoodsList.code == "200") {
      var Data = OrderGoodsList.data.deliveryDetails;
      var UpID = Data[0].sourceid;
      return { code: OrderGoodsList.code, UpID: UpID };
    } else {
      return { code: OrderGoodsList.code, message: OrderGoodsList.message };
    }
  }
}
exports({ entryPoint: MyTrigger });