let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取角色id
    var roleId = request.roleId;
    //获取token
    let getAccessToken = extrequire("GT84332AT19.backDefaultGroup.getAccessToken");
    var paramToken = {};
    let resToken = getAccessToken.execute(paramToken);
    var token = resToken.access_token;
    //调用API接口查询
    let url = "https://www.example.com/" + token;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let body = {
      roleId: roleId,
      pageNumber: 1,
      pageSize: 1000
    };
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    var resp = JSON.parse(strResponse);
    return resp;
  }
}
exports({ entryPoint: MyAPIHandler });