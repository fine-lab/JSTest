let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取时间戳和加密后的签名，用于调用驿氪接口
    var timeStamp = request.timeStamp;
    var appId = "yourIdHere";
    var token = "yourtokenHere";
    var appSystem = "YS";
    var strSha1 = "AppId=" + appId + "&Timestamp=" + timeStamp + "&Token=" + token;
    //生成动态sign，转大写
    var sign = SHA1Encode(strSha1);
    sign = sign.toUpperCase();
    var signInfo = { sign: sign, timeStamp: timeStamp, appId: appId, token: token, appSystem: appSystem };
    return { signInfo };
  }
}
exports({ entryPoint: MyAPIHandler });