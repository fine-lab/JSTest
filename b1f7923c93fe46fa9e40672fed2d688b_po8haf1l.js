let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //请求地址
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    if (request.phone == "" || request.phone == null) {
      return {};
    }
    //通过crmID查询用户是否存在
    var sqlMembers = "select id from uhybase.members.Members where cPhone ='" + request.phone + "'  limit 0,1";
    var resMembers = ObjectStore.queryByYonQL(sqlMembers, "uhy");
    if (resMembers.length > 0) {
      //不存在新增
      return { msg: "会员存在" };
    }
    //获取crmtoken
    let body = { code: "thirdToken" };
    var parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
    console.log("获取crmtoken:" + parambase);
    var param = JSON.parse(parambase);
    let func1 = extrequire("SDMB.base.getToken");
    let restoken = func1.execute();
    var token = restoken.access_token;
    //请求CRM获得会员信息
    let posbody = {
      appCode: "albionPos",
      identifyKey: "yourKeyHere",
      identifyValue: request.phone,
      membershipSystemId: "1",
      partnerId: "1"
    };
    let posheader = { "Content-Type": "application/json", thirdToken: param.data.value };
    let res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/getMember?access_token=" + token, JSON.stringify(posheader), JSON.stringify(posbody));
    console.log(res);
    if (res == null) {
      //返回结果为null,更新token重新调用
      console.log("返回结果为null,更新token重新调用======>");
      let func2 = extrequire("SDMB.base.getCrmToken2");
      let eceres = func2.execute();
      console.log("重新获取token返回数据" + JSON.stringify(eceres));
      body = { code: "thirdToken" };
      parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
      param = JSON.parse(parambase);
      posheader = { "Content-Type": "application/json", thirdToken: param.value };
      res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/getMember?access_token=" + token, JSON.stringify(posheader), JSON.stringify(posbody));
    }
    console.log("查询会员:" + res);
    res = JSON.parse(res);
    if (res.errorCode == "2002") {
      return { msg: "会员不存在" };
    }
    var data = {
      cCountryCode: "86",
      crmID: res.data.memberId,
      cRealName: res.data.name,
      cUserName: res.data.nickName,
      cPhone: res.data.phone,
      memberGrade: res.data.memberGrade,
      crmCreateTime: res.data.createTime
    };
    //插入会员数据
    let savebody = { data: data };
    let saveres = openLinker("post", buzUrl + "/po8haf1l/crmApi/member/member/save", "SDMB", JSON.stringify(savebody));
    return { msg: "会员查询完毕" };
  }
}
exports({ entryPoint: MyAPIHandler });