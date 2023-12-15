let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = request.uri;
    let body = request.body; //请求参数
    let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });