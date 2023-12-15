let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let context = JSON.parse(AppContext());
    let baseurl = context.currentUser.tenantId === "z1ia45ba" ? "https://open-api-dbox.yyuap.com" : "https://api.diwork.com";
    let url = baseurl + request.uri;
    let body = request.body; //请求参数
    if (request.parm !== undefined) {
      url += "?" + request.parm;
    }
    let apiResponse = openLinker("POST", url, "GT6948AT29", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });