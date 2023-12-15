let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let yhtUserId = request.yhtUserId;
    let body = request.body;
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
      let query_url = "https://www.example.com/";
      let detail = postman("post", query_url, JSON.stringify(header), JSON.stringify(body));
    }
    return {};
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });