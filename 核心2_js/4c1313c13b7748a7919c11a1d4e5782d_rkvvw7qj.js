let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var stockOrgId = request.stockOrgId;
    var stockId = request.stockId;
    var qty = Number(request.qty);
    var receiveaddress = request.receiveaddress;
    var receiveId = request.receiveId;
    var agentId = request.agentId;
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var simple = {
      stockOrgId: stockOrgId,
      stockId: stockId,
      qty: qty,
      receiveaddress: receiveaddress,
      receiveId: receiveId,
      agentId: agentId
    };
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res = func.execute(request);
    var token = res.access_token;
    //请求数据udinghuo.orderyfrule.saleorderyf
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(simple));
    var obj = JSON.parse(apiResponse);
    var data = obj.data;
    var price = data.price;
    return { price: price };
  }
}
exports({ entryPoint: MyAPIHandler });