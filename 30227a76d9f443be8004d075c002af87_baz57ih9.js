let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let enstring = param[0]["id"];
    let url = "https://www.example.com/";
    let appKey = "yourKeyHere";
    let accessToken = "yourTokenHere";
    let resultType = "json";
    let timestamp = parseInt(new Date().getTime() / 1000);
    var oauth = MD5Encode(appKey + timestamp + accessToken);
    let callUrl = url + "?oauth=" + oauth + "&appKey=" + appKey + "&timestamp=" + timestamp + "&resultType=" + resultType + "&id=" + id + "&EncryptString=" + enstring;
    var strResponse = postman("get", callUrl, null, null);
    let result = JSON.parse(strResponse);
    return result;
  }
}
exports({ entryPoint: MyTrigger });