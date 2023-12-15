let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用-传参分别为： appkey, appsecrect
    var access_token = getToken("d114bca3fbfa4f74ad71bca513ca60d7", "2871ee72c7ae4d3c93af8bdcda545c78");
    //获取token方法
    function getToken(yourappkey, yourappsecrect) {
      //设置返回的access_token
      var access_token;
      // 获取token的url
      const token_url = "https://www.example.com/";
      const appkey = yourappkey;
      const appsecrect = yourappsecrect;
      // 当前时间戳
      let timestamp = new Date().getTime();
      const secrectdata = "appKey" + appkey + "timestamp" + timestamp;
      //加密算法------------------------------------------------------------------------------------------
      var res = HmacSHA256(secrectdata, yourappsecrect);
      function Base64stringify(wordArray) {
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;
        var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        wordArray.clamp();
        var base64Chars = [];
        for (var i = 0; i < sigBytes; i += 3) {
          var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
          var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
          var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
          var triplet = (byte1 << 16) | (byte2 << 8) | byte3;
          for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
            base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
          }
        }
        var paddingChar = map.charAt(64);
        if (paddingChar) {
          while (base64Chars.length % 4) {
            base64Chars.push(paddingChar);
          }
        }
        return base64Chars.join("");
      }
      //加密算法------------------------------------------------------------------------------------------
      var sha256 = res;
      const base64 = Base64stringify(sha256);
      // 获取签名
      const signature = encodeURIComponent(base64);
      const requestUrl = token_url + "?appKey=" + appkey + "&timestamp=" + timestamp + "&signature=" + signature;
      const header = {
        "Content-Type": "application/json"
      };
      var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
      //获取token
      var responseObj = JSON.parse(strResponse);
      if ("00000" == responseObj.code) {
        access_token = responseObj.data.access_token;
      }
      return requestUrl;
    }
    return { access_token: access_token };
  }
}
exports({ entryPoint: MyAPIHandler });