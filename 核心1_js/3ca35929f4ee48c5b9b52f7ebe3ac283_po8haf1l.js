let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //请求地址
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    let func1 = extrequire("SDMB.base.getToken");
    let restoken = func1.execute();
    var token = restoken.access_token;
    //获取crmtoken
    let body = { code: "thirdToken" };
    var parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
    console.log(parambase);
    var param = JSON.parse(parambase);
    //获取时间脚本调用
    let date = extrequire("SDMB.base.getNowDate");
    let dateFormat = date.execute("yyyy-MM-dd HH:mm:ss");
    var endTime = dateFormat.date;
    let date2 = extrequire("SDMB.base.getNowDate2");
    let dateFormat2 = date2.execute("yyyy-MM-dd HH:mm:ss");
    var startTime = dateFormat2.date;
    console.log("开始时间startTime" + startTime);
    console.log("结束时间endTime" + endTime);
    //请求CRM获得会员信息
    let posbody = {
      appCode: "albionPos",
      countOnly: "true",
      membershipSystemId: "1",
      partnerId: "1",
      queryCreateTimeEnd: endTime,
      queryCreateTimeStart: startTime,
      startMemberId: "0"
    };
    let posheader = { "Content-Type": "application/json", thirdToken: param.data.value };
    let res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/getBatchMember?access_token=" + token, JSON.stringify(posheader), JSON.stringify(posbody));
    if (res == null) {
      console.log("返回结果为null,更新token重新调用同步会员数量");
      let func2 = extrequire("SDMB.base.getCrmToken2");
      let eceres = func2.execute();
      body = { code: "thirdToken" };
      parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
      param = JSON.parse(parambase);
      posheader = { "Content-Type": "application/json", thirdToken: param.data.value };
      res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/getBatchMember?access_token=" + token, JSON.stringify(posheader), JSON.stringify(posbody));
    }
    res = JSON.parse(res);
    var crmCount = res.data.count; //CRM会员数量
    //查询ys系统中会员数量
    var sql = "select count(id) from uhybase.members.Members where crmCreateTime<'" + endTime + "' and crmCreateTime>'" + startTime + "'";
    var ysCount = ObjectStore.queryByYonQL(sql, "uhy");
    console.log(res);
    var countId = ysCount[0].id;
    var sqlIn = "";
    if (countId < crmCount) {
      posbody.countOnly = false;
      res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/getBatchMember?access_token=" + token, JSON.stringify(posheader), JSON.stringify(posbody));
      res = JSON.parse(res);
      var members = res.data.members;
      for (var i in members) {
        var membersSql = "select crmID from uhybase.members.Members where crmID = '" + members[i].memberId + "'";
        var memberList = ObjectStore.queryByYonQL(membersSql, "uhy");
        if (memberList.length > 0) {
          sqlIn = sqlIn + memberList[0].crmID;
          console.log("会员" + members[i].memberId + "存在");
        } else {
          console.log("会员" + members[i].memberId + "不存在");
          //会员不存在调用查询接口保存会员
          let memberQueryBody = { phone: members[i].phone };
          var memberQueryRes = openLinker("post", buzUrl + "/po8haf1l/crmApi/memberQuery", "SDMB", JSON.stringify(memberQueryBody));
          console.log(memberQueryRes);
        }
      }
    }
    return { sqlIn };
  }
}
exports({ entryPoint: MyTrigger });