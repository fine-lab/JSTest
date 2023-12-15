let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取入参
    var vbillcodeR = request.vbillcodeP;
    let func = extrequire("ycSaleCoor.backApi.gettoken");
    var result = func.execute();
    var token = result.token;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var query = {};
    var body = { vbillcode: vbillcodeR };
    //消息体
    let allbody = {
      header: header,
      query: query,
      body: body,
      gatewayId: "yourIdHere",
      method: "post",
      url: "http://192.168.0.231:80/service/SupReadService",
      tenantId: "yourIdHere"
    };
    //消息头
    let allheader = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let url = "https://www.example.com/" + token;
    let responseObj = postman("post", url, JSON.stringify(allheader), JSON.stringify(allbody));
    return { res: responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });