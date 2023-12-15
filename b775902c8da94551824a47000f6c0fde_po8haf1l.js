let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //请求地址
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    //获取crmtoken
    let body = { code: "thirdToken" };
    var parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
    console.log(parambase);
    var param = JSON.parse(parambase);
    //请求CRM获得会员信息
    let posbody = {
      appCode: "albionPos",
      countOnly: "true",
      membershipSystemId: "1",
      partnerId: "1",
      queryCreateTimeEnd: "2024-01-01 00:00:00",
      queryCreateTimeStart: "2023-01-25 00:00:00",
      startMemberId: "0"
    };
    let posheader = { "Content-Type": "application/json", thirdToken: param.value };
    let res = postman("POST", "https://www.example.com/", JSON.stringify(posheader), JSON.stringify(posbody));
    if (res == null) {
      console.log("返回结果为null,更新token重新调用======>");
      let param1 = {};
      let param2 = {};
      let func = extrequire("SDMB.base.getCrmToken");
      let eceres = func.execute(param1, param2);
      console.log("重新获取token返回数据" + JSON.stringify(eceres));
      body = { code: "thirdToken" };
      parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
      param = JSON.parse(parambase);
      posheader = { "Content-Type": "application/json", thirdToken: param.value };
      res = postman("POST", "https://www.example.com/", JSON.stringify(posheader), JSON.stringify(posbody));
    }
    res = JSON.parse(res);
    var crmCount = res.data.count; //CRM会员数量
    //查询ys系统中会员数量
    var sql = "select count(1) from uhybase.members.Members ";
    var ysCount = ObjectStore.queryByYonQL(sql, "uhy");
    console.log(res);
    posbody.countOnly = false;
    res = postman("POST", "https://www.example.com/", JSON.stringify(posheader), JSON.stringify(posbody));
    res = JSON.parse(res);
    var members = res.data.members;
    var sqlIn = "";
    for (var i in members) {
      var membersSql = "select crmID from uhybase.members.Members where crmID = '" + members[i].memberId + "'";
      var memberList = ObjectStore.queryByYonQL(membersSql, "uhy");
      if (memberList.length > 0) {
        sqlIn = sqlIn + memberList[0].crmID;
      } else {
        sqlIn = sqlIn + "--";
      }
      if (i == 500) {
        break;
      }
    }
    return { sqlIn };
  }
}
exports({ entryPoint: MyAPIHandler });