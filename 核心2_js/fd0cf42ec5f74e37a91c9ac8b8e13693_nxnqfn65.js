let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取销售订单主表标识
    let orderId = param.data[0].id;
    let agentId = param.data[0].agentId;
    //获取前置订单应用token
    let func1 = extrequire("udinghuo.saleOrder.getFrontToken");
    let tokenRes = func1.execute(context, param);
    let tokenstr = tokenRes.access_token;
    let apiResponse = postman(
      "POST",
      "https://www.example.com/" + tokenstr + "",
      null,
      JSON.stringify({ saleId: orderId, agentId: agentId })
    );
    let apiObj = JSON.parse(apiResponse);
    if (apiObj.code != "200") {
      throw new Error(" - " + apiObj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });