let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let tokenTime = 1.5 * 3600; //token有效时间(秒)U8接口为有效期2小时
    let crmAccesTokenIfUrl = "https://www.example.com/";
    let from_account = "goleerp"; //#调用方id
    let to_account = "goleerp"; //#提供方id
    let app_key = "yourkeyHere"; //#应用key
    let app_secret = "yoursecretHere"; //#应用密钥
    const reqId = param.id;
    let paramVal = "MTkwMzg5aRMgWacxOJlQlT8D";
    let paramToken = "";
    let paramExpiryTime = 0;
    let nowTime = new Date().getTime() / 1000;
    var sql = "select * from AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence where id='" + reqId + "'";
    let resDb = ObjectStore.queryByYonQL(sql, "developplatform");
    if (resDb == null || resDb.length == 0) {
      paramVal = "MTkwMzg5aRMgWacxOJlQlT8D";
    } else {
      app_key = resDb[0].AppKey; //app_key
      app_secret = resDb[0].AppSecret; //app_secret
      paramToken = resDb[0].AppToken;
      paramExpiryTime = resDb[0].paramExpiryTime == null ? 0 : resDb[0].paramExpiryTime;
      if (paramToken == null || paramToken == "" || nowTime > paramExpiryTime + tokenTime) {
        let apiResponse = postman("get", crmAccesTokenIfUrl + "?" + "from_account=" + from_account + "&app_key=" + app_key + "&app_secret=" + app_secret, null, null);
        let accessTokenObj = JSON.parse(apiResponse);
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          context,
          JSON.stringify({ LogToDB: true, logModule: 99, description: "获取accesstoken：" + crmAccesTokenIfUrl, reqt: "", resp: apiResponse })
        );
        if (accessTokenObj != null && accessTokenObj.errcode != 0) {
          let resCode = accessTokenObj.code;
          let resErrMsg = accessTokenObj.errmsg;
          return { rst: false, data: apiResponse, msg: resErrMsg + "[" + resCode + "]" };
        } else {
          let paramTokenObj = accessTokenObj.token;
          paramToken = paramTokenObj.id;
          //更新最新的token
          var object = { id: resDb[0].id, AppToken: paramToken, paramExpiryTime: nowTime, hasDefaultInit: false, isEnabled: true };
          var res = ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence", object, "yb85e13182");
          return { rst: true, data: apiResponse, msg: "success!", accessToken: paramToken, app_key: app_key, app_secret: app_secret, from_account: from_account, to_account: to_account };
        }
      }
    }
    return { reqId: reqId, rst: true, msg: "success!!", accessToken: paramToken, app_key: app_key, app_secret: app_secret, from_account: from_account, to_account: to_account };
  }
}
exports({ entryPoint: MyTrigger });