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
    let OrderGoods = postman("get", URLData.URL + "/iuap-api-gateway/yonbip/sd/voucherdelivery/detail?access_token=" + token + "&id=" + id, JSON.stringify(headers), null);
    let OrderGoodsList = JSON.parse(OrderGoods);
    if (OrderGoodsList.code == "200") {
      var Data = OrderGoodsList.data.deliveryDetails;
      var UpID = Data[0].sourceid;
      return { code: OrderGoodsList.code, UpID: UpID };
    } else {
      return { code: OrderGoodsList.code, message: OrderGoodsList.message };
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });