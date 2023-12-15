let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let appId = "yourIdHere";
    // 应用密钥
    let appKey = "yourKeyHere";
    // 接口调用域名
    let host = "https://smlopenapi.esign.cn";
    let getApi = "/v3/sign-flow/sign-flow-initiate-url/by-file";
    //  接口请求地址
    let hostGetApi = "https://smlopenapi.esign.cn" + getApi;
    // 构建待签名字符串
    let method = "GET";
    let accept = "*/*";
    let contentType = "application/json; charset=UTF-8";
    let url = getApi;
    let date = "";
    let headers = "";
    let sb = method + "\n" + accept + "\n" + contentMD5 + "\n" + contentType + "\n" + date + "\n";
    if ("".equals(headers)) {
      sb += headers + url;
    } else {
      sb += headers + "\n" + url;
    }
    var hmacSHA256 = HmacSHA256(sb, appKey);
    var res = Base64Decode(hmacSHA256);
    // 获取时间戳(精确到毫秒)
    let timeStamp = new Date().getTime();
    const header = {
      "X-Tsign-Open-App-Id": "'" + data.get("appId") + "'",
      "X-Tsign-Open-Auth-Mode": "Signature",
      "X-Tsign-Open-Ca-Timestamp": "'" + timeStamp + "'",
      Accept: "'" + accept + "'",
      "Content-Type": "'" + contentType + "'",
      "X-Tsign-Open-Ca-Signature": "'" + res + "'",
      "Content-MD5": "'" + contentMD5 + "'"
    };
    var strResponse = postman("GET", hostGetSignFlowApi, JSON.stringify(header), "UTF-8");
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });