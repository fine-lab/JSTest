let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前租户ID
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    //使用公共函数--------------begin
    let tokenfun = extrequire("test04.myConfig.getTokenApi");
    let token = tokenfun.execute(request).access_token;
    let configfun = extrequire("test04.myConfig.baseConfig");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var requrl = config.config.baseUrl + "/yonbip/digitalModel/warehouse/list?access_token=" + token;
    var apiData = { pageIndex: 1, pageSize: 10000, iUsed: "enable" };
    var strResponse = openLinker("POST", requrl, "9fdb0e2c", JSON.stringify(apiData));
    var resObj = JSON.parse(strResponse);
    var returncom = [];
    if (resObj !== null) {
      if (resObj.data != null && resObj.data.recordCount > 0) {
        for (var i = 0; i < resObj.data.recordCount; i++) {
          var pushcom = { value: resObj.data.recordList[i].id, text: resObj.data.recordList[i].name, nameType: "string" };
          returncom.push(pushcom);
        }
      }
    }
    return { returncom };
  }
}
exports({ entryPoint: MyAPIHandler });