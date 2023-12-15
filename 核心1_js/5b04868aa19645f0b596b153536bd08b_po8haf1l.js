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
    for (var i in data) {
      var couponSN = data[i].couponSN;
      var couponpredata = data[i].couponpredata; //卡券信息数组
      for (var j in couponpredata) {
        couponpredatalist.push({ cSN: couponpredata[j].cSN, cPassword: couponpredata[j].cPassword });
      }
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
      dataList.push({ couponId: id, couponpredata: couponpredatalist });
    }
    let body = { data: dataList };
    let header = {};
    apiResponse = openLinker("post", buzUrl + "/yonbip/sd/coupon/prereceive", "SDMB", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });