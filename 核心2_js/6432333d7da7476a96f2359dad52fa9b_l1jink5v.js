let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var strResponse = postman(
      "get",
      "https://www.example.com/" + request.access_token + "&id=" + request.productId + "&productApplyRangeId=" + request.applyRangeId,
      null,
      null
    );
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });