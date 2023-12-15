let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let context = JSON.parse(AppContext());
    let baseurl = context.currentUser.tenantId === "z1ia45ba" ? "https://open-api-dbox.yyuap.com" : "https://www.example.com/";
    let url = baseurl + request.uri;
    if (request.parm !== undefined) {
      let parms = request.parm;
      let i = 0;
      for (let key in parms) {
        let value = parms[key];
        if (i == 0) {
          url += "?" + key + "=" + value;
        } else {
          url += "&" + key + "=" + value;
        }
        i++;
      }
    }
    let apiResponse = openLinker("GET", url, "GT6948AT29", JSON.stringify({})); //TODO：注意填写应用编码(请看注意事项)
    let res = JSON.parse(apiResponse);
    if (res.code == 999 || res.code == undefined || res.code !== 200) {
      var object = {
        code: res.code,
        url: url,
        body: JSON.stringify({}),
        parmdeal: JSON.stringify(request.parm),
        method: "GET",
        errmsg: res.message
      };
      ObjectStore.insert("GT6948AT29.GT6948AT29.logdata", object, "1437941375524929536");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });