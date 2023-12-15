let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let result = new Array();
    if (request.hasOwnProperty("warehouse") && request.hasOwnProperty("store") && request.hasOwnProperty("products")) {
      let warehouse = request.warehouse;
      let store = request.store;
      let products = request.products;
      if (isNotEmpty(warehouse) && isNotEmpty(store) && products.length != 0) {
        let productidsstr = "";
        for (let i = 0; i < products.length; i++) {
          let productID = products[i]; //商品id
          productidsstr = productidsstr + "'" + productID + "',";
        }
        let productids = productidsstr.substring(0, productidsstr.length - 1);
        let res = queryAvailableqty(store, warehouse, productids);
        if (undefined != res && res.length > 0) {
          result = res;
        }
      }
    }
    function queryAvailableqty(store, iWarehouseid, productID) {
      let sql = "select * from stock.currentstock.CurrentStock where  warehouse='" + iWarehouseid + "' and  product in(" + productID + ")";
      var res = ObjectStore.queryByYonQL(sql, "ustock");
      return res;
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