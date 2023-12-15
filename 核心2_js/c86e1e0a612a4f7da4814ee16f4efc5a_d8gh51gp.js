let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var dwValue = request.sjdw; //送检单位
    var jcxmValue = request.jcxm; //检测项目
    var sydlxValue = request.sydlx; //收样单类型
    var querySql = "select * from AT15F164F008080007.AT15F164F008080007.pricTable where dr=0 and project='" + jcxmValue + "' and sydType='" + sydlxValue + "' and merchant='" + dwValue + "'";
    var res = ObjectStore.queryByYonQL(querySql, "developplatform");
    if (res.length > 0) {
      var queryTaxSql = "select * from bd.taxrate.TaxRateVO where id='" + res[0].taxRate + "'";
      var taxTes = ObjectStore.queryByYonQL(queryTaxSql, "ucfbasedoc");
      var pricTableValue = res[0];
      pricTableValue.taxRateCode = taxTes[0].code;
      pricTableValue.ntaxRate = taxTes[0].ntaxRate;
      return { pricTableValue };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });