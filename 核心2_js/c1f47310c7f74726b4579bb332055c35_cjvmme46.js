let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var flagValue = request.flag;
    var queryHsql = "select * from voucher.delivery.DeliveryVoucher where id='" + id + "'";
    var hRes = ObjectStore.queryByYonQL(queryHsql, "udinghuo");
    let body = {
      datas: [
        {
          id: id,
          deliveryVoucherDefineCharacter: {
            attrext4: flagValue,
            id: hRes[0].deliveryVoucherDefineCharacter.id
          }
        }
      ]
    };
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let httpUrl = "https://www.example.com/";
    let httpRes = postman("GET", httpUrl, JSON.stringify(header), JSON.stringify(null));
    let httpResData = JSON.parse(httpRes);
    if (httpResData.code != "00000") {
      throw new Error("获取数据中心信息出错" + httpResData.message);
    }
    let httpurl = httpResData.data.gatewayUrl;
    let func1 = extrequire("SCMSA.jyApi.getToken");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = httpurl + "/yonbip/sd/api/updateDeliveryDefineCharacter?access_token=" + token;
    let resSql = openLinker("POST", url, "SCMSA", JSON.stringify(body));
    return { resSql };
  }
}
exports({ entryPoint: MyAPIHandler });