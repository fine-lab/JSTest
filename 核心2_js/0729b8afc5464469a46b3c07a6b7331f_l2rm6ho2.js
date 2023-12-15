let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let appKey = request.appKey;
    let secretKey = request.secretKey;
    let shopIdenty = request.shopIdenty;
    let version = request.version;
    let timestamp = request.timestamp;
    let token_url = request.token_url;
    //使用
    var access_token = getToken(token_url, appKey, secretKey, shopIdenty, version, timestamp);
    //获取token方法
    function getToken(krytoken_url, kryappkey, kryappsecrect, kryshopIdenty, kryversion, krytimestamp) {
      //设置返回的access_token
      let access_token;
      let token_url = krytoken_url;
      let appkey = kryappkey;
      let shopIdenty = kryshopIdenty;
      let version = kryversion;
      let appsecrect = kryappsecrect;
      // 当前时间戳
      let timestamp = krytimestamp;
      let secrectdata = "appKey" + appkey + "shopIdenty" + shopIdenty + "timestamp" + timestamp + "version" + version + appsecrect;
      //加密算法------------------------------------------------------------------------------------------
      let resdata = SHA256Encode(secrectdata);
      // 获取签名
      let signature = encodeURIComponent(resdata);
      let requestUrl = token_url + "?appKey=" + appkey + "&shopIdenty=" + shopIdenty + "&version=" + version + "&timestamp=" + timestamp + "&sign=" + signature;
      let header = {
        "Content-Type": "application/json"
      };
      let strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
      //获取token
      let res = JSON.parse(strResponse);
      if ("0" == res.code) {
        access_token = res.result.token;
      }
      return access_token;
    }
    return { access_token: access_token };
  }
}
exports({ entryPoint: MyAPIHandler });