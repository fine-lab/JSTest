let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    let apiResponse;
    var midsql = "select id from uhybase.members.Members where crmID ='" + request.crmID + "'  limit 0,1";
    var midres = ObjectStore.queryByYonQL(midsql, "uhy");
    if (midres.length < 1) {
      var apires = {};
      apires.code = "409";
      apires.message = "会员不存在";
      apiResponse = JSON.stringify(apires);
      return { apiResponse };
    }
    var mid = midres[0].id;
    var snSql = "select id,iMemberID.crmID from uhybase.coupon.CouponreceiverecordAvailable left join iMemberID on iMemberID = members.id where cSN ='" + request.cSN + "'  limit 0,1";
    var snRes = ObjectStore.queryByYonQL(snSql, "uhy");
    try {
      if (snRes[0].iMemberID_crmID == request.crmID) {
        var apires = {};
        apires.code = "201";
        apires.message = "卡券已领取";
        apiResponse = JSON.stringify(apires);
        return { apiResponse };
      }
    } catch (e) {
    } finally {
    }
    console.log("request:" + JSON.stringify(request));
    let body = { mid: mid, sn: request.cSN };
    let header = {};
    apiResponse = openLinker("post", buzUrl + "/yonbip/sd/coupon/presale/receive", "SDMB", JSON.stringify(body));
    console.log(apiResponse);
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });