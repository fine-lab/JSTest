let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    let workNotice = extrequire("GT30659AT3.backDefaultGroup.workNotice");
    var yhtUserId = currentUser.id;
    let token_url = "https://www.example.com/" + yhtUserId;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    var d;
    var tr = JSON.parse(tokenResponse);
    var content;
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let header = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var body = {
        orgName: request.orgName,
        email: request.email,
        roleId: request.roleId
      };
      let query_url = "https://www.example.com/";
      let detail = postman("post", query_url, JSON.stringify(header), JSON.stringify(body));
      content = detail;
      d = JSON.parse(detail);
      var notice = { title: "自动授权", content: content };
      var object2 = { id: request.id, syncstatus: "已同步", memo: detail };
      var res2 = ObjectStore.updateById("GT32996AT2.GT32996AT2.auto_org_permission", object2);
    }
    return d;
  }
}
exports({ entryPoint: MyAPIHandler });