let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let object = { id: id, invalidState: "2" };
    let res = ObjectStore.updateById("GT30660AT4.GT30660AT4.advisor_cert_pre", object, "d4f08ebb");
    // 作废单据
    let yhtUserId = request.yhtUserId;
    let code1 = request.code;
    let token_url = "https://www.example.com/" + yhtUserId;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    var result;
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let header = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      let query_url = "https://www.example.com/" + code1;
      let detail = postman("get", query_url, JSON.stringify(header), null);
      result = JSON.parse(detail);
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });