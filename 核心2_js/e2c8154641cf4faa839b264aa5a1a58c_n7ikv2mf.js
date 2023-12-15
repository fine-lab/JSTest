let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var yhtUserId = request.yhtUserId;
    var token = request.token;
    if (!token) {
      let getAccessToken = extrequire("GT32996AT2.OpenAPI.getAccessToken");
      var paramToken = {};
      resToken = getAccessToken.execute(paramToken);
      token = resToken.access_token;
    }
    let body = {
      userId: [yhtUserId]
    };
    var strResponse = postman("post", "https://www.example.com/" + token, null, JSON.stringify(body));
    var resp = JSON.parse(strResponse);
    return resp; //resp.data.data[0];
  }
}
exports({ entryPoint: MyAPIHandler });