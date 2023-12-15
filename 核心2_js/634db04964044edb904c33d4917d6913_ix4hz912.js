let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let tokenTime = 2 * 3600; //token有效时间(秒)
    let crmAccesTokenIfUrl = "https://www.example.com/";
    const reqSecretKey = param == null ? null : JSON.stringify(param).secretKey;
    let paramVal = "MTkwMzg5aRMgWacxOJlQlT8D";
    let paramToken = "";
    let paramExpiryTime = 0;
    let nowTime = new Date().getTime() / 1000;
    if (reqSecretKey == null || reqSecretKey == undefined || reqSecretKey == "") {
      var sql = "select * from GT3734AT5.GT3734AT5.SelfDevParams where paramKey='yourKeyHere'";
      let resDb = ObjectStore.queryByYonQL(sql);
      if (resDb == null || resDb.length == 0) {
        paramVal = "MTkwMzg5aRMgWacxOJlQlT8D";
      } else {
        paramVal = resDb[0].paramVal;
        paramToken = resDb[0].paramToken;
        paramExpiryTime = resDb[0].paramExpiryTime == null ? 0 : resDb[0].paramExpiryTime;
        if (paramToken == null || paramToken == "" || nowTime > paramExpiryTime + tokenTime) {
          let apiResponse = postman("get", crmAccesTokenIfUrl + paramVal, null, null);
          let accessTokenObj = JSON.parse(apiResponse);
          extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
            context,
            JSON.stringify({ LogToDB: true, logModule: 0, description: "获取accesstoken：" + crmAccesTokenIfUrl + paramVal, reqt: "", resp: apiResponse })
          );
          if (accessTokenObj != null && accessTokenObj.code != 0) {
            let resCode = accessTokenObj.code;
            let resErrMsg = accessTokenObj.errMsg;
            return { rst: false, data: apiResponse, msg: resErrMsg + "[" + resCode + "]" };
          } else {
            paramToken = accessTokenObj.data;
            //更新最新的token
            var object = { id: resDb[0].id, paramToken: paramToken, paramExpiryTime: nowTime };
            var res = ObjectStore.updateById("GT3734AT5.GT3734AT5.SelfDevParams", object, "cc3a565d");
            return { rst: true, data: apiResponse, msg: "success!", accessToken: paramToken };
          }
        }
      }
    }
    return { rst: true, msg: "success!", accessToken: paramToken };
  }
}
exports({ entryPoint: MyTrigger });