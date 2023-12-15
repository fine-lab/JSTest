let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    var data = request.data; //data数组
    let dataList = [];
    let couponpredatalist = [];
    let apiResponse;
    var couponSN = data.couponSN;
    var couponpredata = data.couponpredata; //卡券信息数组
    couponpredatalist.push({ cSN: couponpredata.cSN, cPassword: couponpredata.cPassword });
    //根据接口传入的卡券code查询id
    var sql = "select id from uhybase.coupon.Coupon where  couponSN ='" + couponSN + "'  limit 0,1";
    var res = ObjectStore.queryByYonQL(sql, "uhy");
    if (res.length < 1) {
      var apires = {};
      apires.code = "999";
      apires.message = "卡券档案不存在";
      apiResponse = JSON.stringify(apires);
      return { apiResponse };
    }
    var id = res[0].id;
    var snSql = "select * from uhybase.coupon.CouponreceiverecordAvailable where cSN ='" + couponpredata.cSN + "'  limit 0,1";
    var snRes = ObjectStore.queryByYonQL(snSql, "uhy");
    console.log(snRes);
    if (snRes.length > 0) {
      var apires = {};
      apires.code = "201";
      apires.message = "卡券已被发放过";
      apiResponse = JSON.stringify(apires);
      return { apiResponse };
    }
    dataList.push({ couponId: id, couponpredata: couponpredatalist });
    let body = { data: dataList };
    console.log("body:" + JSON.stringify(body));
    let header = {};
    apiResponse = openLinker("post", buzUrl + "/yonbip/sd/coupon/prereceive", "SDMB", JSON.stringify(body));
    console.log("res:" + apiResponse);
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });