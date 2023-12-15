let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.date.pid;
    let func1 = extrequire("GT2688AT7.backDesignerFunction.token1");
    throw new Error(JSON.stringify(func1));
    let res = func1.execute(request);
    let token = res.access_token;
    let url = "https://www.example.com/" + token + "'?id='" + id + "'";
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    // 表头
    let header = {
      "Content-Type": contenttype
    };
    let apiResponse = apiman("POST", url, JSON.stringify(header), JSON.stringify(null));
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });