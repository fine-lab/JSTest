let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let baseurl = "https://www.example.com/";
    let url = baseurl + request.uri;
    let body = request.body; //请求参数
    let apiResponse = openLinker("POST", url, "GT1479AT24", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });