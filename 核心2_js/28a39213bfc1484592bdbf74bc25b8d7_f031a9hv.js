let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiResponse = postman(
      "get",
      "https://www.example.com/" + request.access_token + "&code=" + request.code,
      "",
      ""
    );
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });