let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var server = extrequire("GT15312AT4.tool.getServer").execute(null, null);
    var rows = ObjectStore.selectByMap("GT15312AT4.GT15312AT4.AccessInfo", { tenant_id: tid, profile: server.profile });
    var row;
    if (rows == null || rows.length == 0) {
      //没注册
      var password = MD5Encode(tid);
      const header = {
        "Content-Type": "application/json",
        "Tenant-Id": tid,
        Authorization: "Basic " + Base64Encode("yonyou:yonyoucmp")
      };
      let apiResponse = postman("post", server.url + "/api/blade-system/register/simple?username=" + tid + "&password=" + password + "&tenantId=" + tid, JSON.stringify(header), "{}");
      let registerResult = JSON.parse(apiResponse);
      if (registerResult.code == 200) {
        row = {
          tenant_id: tid,
          user_name: tid,
          password: password,
          profile: server.profile
        };
        var result = ObjectStore.insert("GT15312AT4.GT15312AT4.AccessInfo", row, "null");
        row.id = result.id;
      } else {
      }
    } else {
      row = rows[0];
    }
    if (!row.access_token || row.expires_in == "NaN" || row.expires_in < new Date().getTime()) {
      const header = {
        "Content-Type": "application/json",
        "Tenant-Id": tid,
        Authorization: "Basic " + Base64Encode("yonyou:yonyoucmp")
      };
      let apiResponse = postman(
        "post",
        server.url + "/api/blade-auth/oauth/token?username=" + row.user_name + "&password=" + row.password + "&grant_type=password&scope=all",
        JSON.stringify(header),
        "{}"
      );
      let remoteToken = JSON.parse(apiResponse);
      row.expires_in = (new Date().getTime() + remoteToken.expires_in * 1000).toString();
      row.user_id = remoteToken.user_id;
      row.user_name = remoteToken.user_name;
      row.account = remoteToken.account;
      row.dept_id = remoteToken.dept_id;
      row.access_token = remoteToken.access_token;
      row.refresh_token = remoteToken.refresh_token;
      var rowUpdate = ObjectStore.updateById("GT15312AT4.GT15312AT4.AccessInfo", row, "null");
    }
    return row;
  }
}
exports({
  entryPoint: MyAPIHandler
});