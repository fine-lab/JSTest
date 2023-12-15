let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let context = JSON.parse(AppContext());
    let baseurl = context.currentUser.tenantId === "z1ia45ba" ? "https://open-api-dbox.yyuap.com" : "https://api.diwork.com";
    let url = baseurl + request.uri;
    if (request.parm !== undefined) {
      let parms = request.parm;
      let n = 0;
      for (let key in parms) {
        let value = parms[key];
        if (n === 0) {
          url += "?" + key + "=" + value;
        } else {
          url += "&" + key + "=" + value;
        }
        n++;
      }
    }
    let body = request.body; //请求参数
    let apiResponse = openLinker("POST", url, "GT21097AT3", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let res = JSON.parse(apiResponse);
    delete request.parm;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });