let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let orgId = request.orgId;
    let url = "https://www.example.com/";
    let appKey = "yourKeyHere";
    let accessToken = "yourTokenHere";
    let resultType = "json";
    let timestamp = parseInt(new Date().getTime() / 1000);
    var oauth = MD5Encode(appKey + timestamp + accessToken);
    let callUrl = url + "?oauth=" + oauth + "&appKey=" + appKey + "&timestamp=" + timestamp + "&resultType=" + resultType + "&id=" + id + "&orgId=" + orgId;
    var strResponse = postman("get", callUrl, null, null);
    let result = JSON.parse(strResponse);
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });