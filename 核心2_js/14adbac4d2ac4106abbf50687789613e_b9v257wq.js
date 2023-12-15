let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var timeStamp = request.timeStamp;
    var enviRonment = request.environment;
    var appId = "";
    var token = "";
    var appSystem = "";
    if (enviRonment == "WallpaperSTORE") {
      appId = "yourIdHere";
      token = "yourtokenHere";
      appSystem = "YS";
    } else if (enviRonment == "一善书店") {
      appId = "yourIdHere";
      token = "yourtokenHere";
      appSystem = "YS";
    } else {
      appId = "";
      token = "";
      appSystem = "";
    }
    var strSha1 = "AppId=" + appId + "&Timestamp=" + timeStamp + "&Token=" + token;
    //生成动态sign，转大写
    var sign = SHA1Encode(strSha1);
    sign = sign.toUpperCase();
    var signInfo = { sign: sign, timeStamp: timeStamp, appId: appId, token: token, appSystem: appSystem };
    return { signInfo };
  }
}
exports({ entryPoint: MyAPIHandler });