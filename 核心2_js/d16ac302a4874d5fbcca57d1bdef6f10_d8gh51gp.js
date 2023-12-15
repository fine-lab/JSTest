let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var dwValue = request.sjdw; //送检单位
    var sydlxValue = request.sydlx; //收样单类型
    var querySql = "select * from AT15F164F008080007.AT15F164F008080007.jSandSj where dr=0 and sydType='" + sydlxValue + "' and sjMerchant='" + dwValue + "'";
    var res = ObjectStore.queryByYonQL(querySql, "developplatform");
    var merchantValue = {
      merchantId: null,
      merchantName: null
    };
    if (res.length > 0) {
      var queryTaxSql = "select * from aa.merchant.Merchant where id='" + res[0].jsMerchant + "'";
      var taxTes = ObjectStore.queryByYonQL(queryTaxSql, "productcenter");
      merchantValue.merchantId = taxTes[0].id;
      merchantValue.merchantName = taxTes[0].name;
    }
    return { merchantValue };
  }
}
exports({ entryPoint: MyAPIHandler });