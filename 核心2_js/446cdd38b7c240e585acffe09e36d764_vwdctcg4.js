let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("udinghuo.saleOrder.getFrontToken");
    let tokenRes = func1.execute(context, param);
    let tokenstr = tokenRes.access_token;
    var apiObject = [];
    let apiResponse = postman("POST", "https://www.example.com/" + tokenstr + "", null, JSON.stringify({ apiObj: apiObject }));
    let apiObj = JSON.parse(apiResponse);
    if (apiObj.code != "200") {
      throw new Error(" - " + apiObj.message + "##returnOrderDetailStr:" + returnOrderDetailStr + "##");
    }
    return { data: apiResponse };
  }
}
exports({ entryPoint: MyTrigger });