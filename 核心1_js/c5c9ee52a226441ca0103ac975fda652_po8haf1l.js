let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    request = request.data;
    console.log(JSON.stringify(request));
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
    console.log(request);
    var orderList = [];
    var storeSql = "select codebianma from aa.store.Store where code = '" + request.cStoreCode + "'";
    var stores = ObjectStore.queryByYonQL(storeSql, "yxybase");
    //零售订单信息
    var coupInfo = request.retailvouchgifttoken;
    var coupNos = [];
    if (coupInfo != null) {
      coupInfo.map((item, index, arr) => {
        console.log(arr); // arrObj
        console.log(index); // 0 1 2
        console.log(item.name); // xiaohua xiaomin xiaobai
        coupNos.push(item.cGiftTokensn);
      });
    } else {
      return;
    }
    //构建零售单参数
    let res;
    //销售明细
    var retailVouchDetails = request.retailVouchDetails;
    //通过手机号查询用户CRMID是否存在
    var sql = "select crmID from uhybase.members.Members where cPhone ='" + request.iMemberid_cphone + "'  limit 0,1";
    var sqlres = ObjectStore.queryByYonQL(sql, "uhy");
    var crmID = sqlres[0].crmID;
    let func1 = extrequire("SDMB.base.getToken");
    let restoken = func1.execute();
    var token = restoken.access_token;
    if (request.billingStatus == "FormerBackBill") {
      var data = {
        salesNo: request.code,
        memberId: Number(crmID),
        coupNos: coupNos,
        partnerId: 1
      };
      console.log("推送退单返还卡券参数:" + JSON.stringify(data));
      let posheader = { "Content-Type": "application/json", thirdToken: param.data.value };
      res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/cancelConsumePos?access_token=" + token, JSON.stringify(posheader), JSON.stringify(data));
      if (res == "null") {
        //返回结果为null,更新token重新调用
        console.log("返回结果为null,更新token重新调用======>");
        let func2 = extrequire("SDMB.base.getCrmToken2");
        let eceres = func2.execute();
        console.log("重新获取token返回数据" + JSON.stringify(eceres));
        body = { code: "thirdToken" };
        parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
        param = JSON.parse(parambase);
        posheader = { "Content-Type": "application/json", thirdToken: param.data.value };
        res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/cancelConsumePos?access_token=" + token, JSON.stringify(posheader), JSON.stringify(data));
      }
    } else {
      var data = {
        salesNo: request.code,
        memberId: Number(crmID),
        coupNos: coupNos,
        shopCode: stores[0].codebianma,
        consumeTime: request.createTime
      };
      console.log("推送卡券参数:" + JSON.stringify(data));
      let posheader = { "Content-Type": "application/json", thirdToken: param.data.value };
      res = postman("put", buzUrl + "/po8haf1l/crmApi/system/sendConsumePos?access_token=" + token, JSON.stringify(posheader), JSON.stringify(data));
      if (res == "null") {
        //返回结果为null,更新token重新调用
        console.log("返回结果为null,更新token重新调用======>");
        let func2 = extrequire("SDMB.base.getCrmToken2");
        let eceres = func2.execute();
        console.log("重新获取token返回数据" + JSON.stringify(eceres));
        body = { code: "thirdToken" };
        parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/getCrmParam", "SDMB", JSON.stringify(body));
        param = JSON.parse(parambase);
        posheader = { "Content-Type": "application/json", thirdToken: param.data.value };
        res = postman("put", buzUrl + "/po8haf1l/crmApi/system/sendConsumePos?access_token=" + token, JSON.stringify(posheader), JSON.stringify(data));
      }
    }
    console.log(res);
    res = JSON.parse(res);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });