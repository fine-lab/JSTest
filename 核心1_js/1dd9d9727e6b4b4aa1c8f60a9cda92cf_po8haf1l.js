let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    console.log(request);
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    let apiResponse;
    var sql = "select id from uhybase.coupon.CouponreceiverecordAvailable where cSN ='" + request.cSN + "'  limit 0,1";
    var res = ObjectStore.queryByYonQL(sql, "uhy");
    if (res.length < 1) {
      var apires = {};
      apires.code = "999";
      apires.message = "该卡券不存在";
      apiResponse = JSON.stringify(apires);
      return { apiResponse };
    }
    request._status = "Update";
    request.id = res[0].id;
    var data = request;
    let body = { data: data, _status: "Update" };
    let header = {};
    apiResponse = openLinker("post", buzUrl + "/po8haf1l/crmApi/coupon/availableCoupons/update/v1", "SDMB", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });