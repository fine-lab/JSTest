let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let orderId = param.data[0].id;
    let agentId = param.data[0].agentId;
    //获取前置订单应用token
    let func1 = extrequire("udinghuo.saleOrder.getFrontToken");
    let tokenRes = func1.execute(context, param);
    let tokenstr = tokenRes.access_token;
    let orderDetClose = param.data[0].orderDetails;
    let lineId = orderDetClose[0]["id"];
    if (lineId == undefined) {
      throw new Error("行标识不能为空");
    }
    let apiResponse = postman(
      "POST",
      "https://www.example.com/" + tokenstr,
      null,
      JSON.stringify({ saleId: orderId, agentId: agentId, lineId: lineId })
    );
    let apiObj = JSON.parse(apiResponse);
    if (apiObj.code != "200") {
      throw new Error(" - " + apiObj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });