let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let result = new Array();
    if (request.hasOwnProperty("orgId") && request.hasOwnProperty("stockId") && request.hasOwnProperty("products")) {
      let orgId = request.orgId;
      let stockId = request.stockId;
      let products = request.products;
      if (isNotEmpty(orgId) && isNotEmpty(stockId) && products.length != 0) {
        let productidsstr = "";
        for (let i = 0; i < products.length; i++) {
          let productID = products[i]; //商品id
          productidsstr = productidsstr + "'" + productID + "',";
        }
        let productids = productidsstr.substring(0, productidsstr.length - 1);
        let saferesult = querySafeStock(orgId, stockId, productids);
        if (undefined != saferesult && saferesult.length > 0) {
          result = saferesult;
        }
      }
    }
    function querySafeStock(orgId, stockId, productIDs) {
      let sql = "select * from 	AT16560C6C08780007.AT16560C6C08780007.aqkcbd where cangku = '" + stockId + "' and wuliao in(" + productIDs + ") and org = '" + orgId + "'";
      let returnres = ObjectStore.queryByYonQL(sql, "developplatform");
      return returnres;
    }
    function isNotEmpty(paramer) {
      if (undefined == paramer || "undefined" == paramer || trim(paramer).length == 0) {
        return false;
      }
      return true;
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });