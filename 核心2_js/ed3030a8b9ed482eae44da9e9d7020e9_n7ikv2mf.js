let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var indexid = request.businessKey.indexOf("_");
    var businessKey = request.businessKey.substring(indexid + 1);
    //实体查询
    var object = { id: businessKey };
    var res = ObjectStore.selectById("GT30660AT4.GT30660AT4.advisor_quit_apply", object);
    var pompBody = {
      yhtUserId: res.yhtUserId
    };
    //调用第三方接口推送数据
    var resultRes = {};
    var hmd_contenttype = "application/json;charset=UTF-8";
    let token_url = "https://www.example.com/" + res.creator;
    let tokenResponse = postman("get", token_url, null, null);
    var tr = JSON.parse(tokenResponse);
    if (tr.code == "200") {
      let appkey = tr.data.appkey;
      let token = tr.data.token;
      let cookie = "appkey=" + appkey + ";token=" + token;
      let pompheader = {
        "Content-Type": hmd_contenttype,
        Cookie: cookie
      };
      var resultRet = postman("post", "https://www.example.com/", JSON.stringify(pompheader), JSON.stringify(pompBody));
      resultRes = JSON.parse(resultRet);
    }
    return resultRes;
  }
}
exports({ entryPoint: MyAPIHandler });