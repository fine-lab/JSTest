let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    console.log(request);
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    //通过手机号查询用户是否存在
    var sql = "select id from uhybase.members.Members where cPhone ='" + request.data.cPhone + "'  limit 0,1";
    var res = ObjectStore.queryByYonQL(sql, "uhy");
    //查询会员等级
    var levelSql = "select id from uhybase.members.Memberlevel where cMemberLevelName ='" + request.data.memberGrade + "'  limit 0,1";
    var levelRes = ObjectStore.queryByYonQL(levelSql, "uhy");
    if (levelRes.length > 0) {
      request.data.iLevelID = levelRes[0].id;
      request.data.memberGrade = "";
    }
    if (res.length < 1) {
      //不存在新增
      request.data._status = "Insert";
      request._status = "Insert";
    } else {
      //存在修改
      request.data._status = "Update";
      request._status = "Update";
      request.data.id = res[0].id;
    }
    let body = request;
    let header = {};
    let apiResponse = openLinker("post", buzUrl + "/po8haf1l/crmApi/member/member/save/v1", "SDMB", JSON.stringify(body));
    console.log(apiResponse);
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });