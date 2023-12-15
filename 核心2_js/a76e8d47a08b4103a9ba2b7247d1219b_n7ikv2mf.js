let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var token = request.token;
    if (!token) {
      let getAccessToken = extrequire("GT32996AT2.OpenAPI.getAccessToken");
      var paramToken = {};
      let resToken = getAccessToken.execute(paramToken);
      token = resToken.access_token;
    }
    let body = {
      roleId: "yourIdHere",
      pageNumber: 1,
      pageSize: 3000
    };
    let strResponse = postman("post", "https://www.example.com/" + token, null, JSON.stringify(body));
    let resp = JSON.parse(strResponse);
    return resp.data;
  }
}
exports({ entryPoint: MyAPIHandler });