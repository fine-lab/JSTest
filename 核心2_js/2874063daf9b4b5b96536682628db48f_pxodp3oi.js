let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let tokenTime = 1.5 * 3600; //token有效时间(秒)U8接口为有效期2小时
    let crmAccesTokenIfUrl = "https://www.example.com/";
    let from_account = "sy2021"; //#调用方id
    let to_account = "test_sy2021"; //#提供方id
    let app_key = "yourkeyHere"; //#应用key
    let app_secret = "yoursecretHere"; //#应用密钥
    const reqSecretKey = param == null ? null : JSON.stringify(param).secretKey;
    let paramVal = "MTkwMzg5aRMgWacxOJlQlT8D";
    let paramToken = "";
    let paramExpiryTime = 0;
    let nowTime = new Date().getTime() / 1000;
    if (reqSecretKey == null || reqSecretKey == undefined || reqSecretKey == "") {
      var sql = "select * from GT3734AT5.GT3734AT5.SelfDevParams where paramKey='yourKeyHere'";
      let resDb = ObjectStore.queryByYonQL(sql, "developplatform");
      if (resDb == null || resDb.length == 0) {
        paramVal = "MTkwMzg5aRMgWacxOJlQlT8D";
      } else {
        app_key = resDb[0].paramVal; //app_key
        app_secret = resDb[0].remark; //app_secret
        from_account = resDb[0].paramHoliday; //from_account
        to_account = resDb[0].paramWorkday; //to_account
        paramToken = resDb[0].paramToken;
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
            var object = { id: resDb[0].id, paramToken: paramToken, paramExpiryTime: nowTime };
            var res = ObjectStore.updateById("GT3734AT5.GT3734AT5.SelfDevParams", object, "cc3a565d");
            return { rst: true, data: apiResponse, msg: "success!", accessToken: paramToken, app_key: app_key, app_secret: app_secret, from_account: from_account, to_account: to_account };
          }
        }
      }
    }
    return { rst: true, msg: "success!", accessToken: paramToken, app_key: app_key, app_secret: app_secret, from_account: from_account, to_account: to_account };
  }
}
exports({ entryPoint: MyTrigger });