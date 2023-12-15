let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var req = request.body;
    var stockOrgId = req.stockOrgId;
    var stockId = req.stockId;
    var qty = req.qty;
    var receiveAddress = req.receiveAddress;
    var receiveId = req.receiveId;
    var agentId = req.agentId;
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    // 前端函数调用后端函数，前端函数传入的参数是放在 request 中
    var body = {
      stockOrgId: stockOrgId,
      stockId: stockId,
      qty: qty,
      receiveaddress: receiveAddress,
      receiveId: receiveId,
      agentId: agentId
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    // 获取 token
    let res = func.execute("");
    var token2 = res.access_token;
    // 请求数据
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body));
    let apiRes = JSON.parse(apiResponse);
    var price = apiRes.data.price;
    return { res: price };
  }
}
exports({ entryPoint: MyAPIHandler });