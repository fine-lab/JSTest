let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let key = "yourkeyHere";
    let sercet = "925285705dd44e59bf94c7cc6b35caff";
    let url = "https://www.example.com/";
    let timestamp = Date.now();
    let param = "appKey" + key + "timestamp" + timestamp;
    var signure = UrlEncode(Base64Encode(HmacSHA256(param, sercet)));
    url = url + "?appKey=" + key + "&timestamp=" + timestamp + "&signature=" + signature;
    let apiResponse = apiman("get", url, null, null);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });