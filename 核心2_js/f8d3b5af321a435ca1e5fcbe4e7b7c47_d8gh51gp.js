let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = {
      importData: request.importData,
      code: request.code
    };
    let header = { key: "yourkeyHere" };
    let url = "http://124.70.66.31:9994/DetectOrder/implementCBJS";
    let strResponse = postman("post", url, null, JSON.stringify(param));
    let msg = "ok";
    return { msg };
  }
}
exports({ entryPoint: MyAPIHandler });