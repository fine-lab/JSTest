let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let result = new Array();
    let products = request.products;
    if (products && products.length != 0) {
      let productidsstr = "";
      for (let i = 0; i < products.length; i++) {
        let productID = products[i]; //商品id
        productidsstr = productidsstr + "'" + productID + "',";
      }
      let productids = productidsstr.substring(0, productidsstr.length - 1);
      let res = queryaccmaterial(productids);
      if (undefined != res && res.length > 0) {
        result = res;
      }
    }
    function queryaccmaterial(productids) {
      let sql = "select productPropCharacterDefine.define91 supplyid,productPropCharacterDefine.define91.name supplyname ,id productid from 		pc.product.Product where id in(" + productids + ")  ";
      var queryRest = ObjectStore.queryByYonQL(sql, "productcenter");
      let result = new Array();
      if (undefined != queryRest && queryRest.length > 0) {
        for (let i = 0; i < queryRest.length; i++) {
          let res = {
            supplyname: queryRest[i].supplyname,
            productid: queryRest[i].productid
          };
          result.push(res);
        }
      }
      return result;
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });