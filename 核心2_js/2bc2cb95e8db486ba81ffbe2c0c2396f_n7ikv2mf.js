let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var yhtUserId = request.yhtUserId;
    var name = request.name;
    var prodline = "";
    let token_url = "https://www.example.com/" + yhtUserId;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    var d;
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let header = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      let query_url = "https://www.example.com/" + name;
      let result = postman("get", query_url, JSON.stringify(header), null);
      let resObj = JSON.parse(result);
      if (resObj.code == "200") {
        let data = resObj.data;
        if (data) {
          prodline = data.prl;
        }
      }
    }
    return { prodline: prodline };
  }
}
exports({ entryPoint: MyAPIHandler });