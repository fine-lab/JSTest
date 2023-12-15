let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let context = JSON.parse(AppContext());
    let baseurl = context.currentUser.tenantId === "z1ia45ba" ? "https://open-api-dbox.yyuap.com" : "https://www.example.com/";
    let url = baseurl + request.uri;
    let body = request.body; //请求参数
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
    let apiResponse = openLinker("POST", url, "GT6948AT29", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let res = JSON.parse(apiResponse);
    if (res.code == 999 || res.code == undefined || res.code !== 200) {
      var object = {
        code: res.code,
        url: url,
        bodydeal: JSON.stringify(body),
        parmdeal: JSON.stringify(request.parm),
        method: "POST",
        errmsg: res.message
      };
      ObjectStore.insert("GT6948AT29.GT6948AT29.logdata", object, "1437941375524929536");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });