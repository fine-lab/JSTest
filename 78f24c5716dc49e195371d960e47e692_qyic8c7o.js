let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let appKey = "yourKeyHere";
    let accessToken = "yourTokenHere";
    let resultType = "json";
    let timestamp = parseInt(new Date().getTime() / 1000);
    var oauth = MD5Encode(appKey + timestamp + accessToken);
    let callUrl = url + "?oauth=" + oauth + "&appKey=" + appKey + "&timestamp=" + timestamp + "&resultType=" + resultType + "&crmid=" + encodeURIComponent(JSON.stringify(request));
    var strResponse = postman(
      "get",
      callUrl,
      null,
      JSON.stringify({
        crmid: JSON.stringify(request)
      })
    );
    return {
      a: strResponse,
      b: { crmid: JSON.stringify(request) },
      c: callUrl
    };
  }
}
exports({ entryPoint: MyAPIHandler });