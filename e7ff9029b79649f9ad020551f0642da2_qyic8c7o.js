let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let resultArr = [];
    request.data.forEach((item) => {
      let id = item.id; //request.id;
      let orgId = item.orgId;
      let url = "https://www.example.com/";
      let appKey = "yourKeyHere";
      let accessToken = "yourTokenHere";
      let resultType = "json";
      let timestamp = parseInt(new Date().getTime() / 1000);
      var oauth = MD5Encode(appKey + timestamp + accessToken);
      let callUrl = url + "?oauth=" + oauth + "&appKey=" + appKey + "&timestamp=" + timestamp + "&resultType=" + resultType + "&id=" + id + "&orgId=" + orgId;
      var strResponse = postman("get", callUrl, null, null);
      let result = JSON.parse(strResponse);
      resultArr.push(result);
    });
    return resultArr;
  }
}
exports({ entryPoint: MyAPIHandler });