let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let result = new Array();
    if (request.hasOwnProperty("purchaseorg") && request.hasOwnProperty("products")) {
      let purchaseorg = request.purchaseorg;
      let products = request.products;
      if (isNotEmpty(purchaseorg) && products.length != 0) {
        let productidsstr = "";
        for (let i = 0; i < products.length; i++) {
          let productID = products[i]; //商品id
          productidsstr = productidsstr + "'" + productID + "',";
        }
        let productids = productidsstr.substring(0, productidsstr.length - 1);
        let res = getPriceByProduct(purchaseorg, productids);
        if (undefined != res && res.length > 0) {
          result = res;
        }
      }
    }
    function getPriceByProduct(purchaseorg, productids) {
      let querysql = "select *  from aa.pricecenter.BiPriceEntity where enable=1 " + " and npriceStatus=0  and vpurchaseOrgId='" + purchaseorg + "' " + " and vmaterialId in(" + productids + ")  ";
      let queryRest = ObjectStore.queryByYonQL(querysql, "cpu-bi-service");
      let result = new Array();
      if (undefined != queryRest && queryRest.length > 0) {
        let productpricemap = new Map();
        for (let i = 0; i < queryRest.length; i++) {
          if (queryRest[i].hasOwnProperty("vmaterialId") && queryRest[i].hasOwnProperty("vpurchaseOrgId") && queryRest[i].hasOwnProperty("vpriceValidate")) {
            let vmaterialId = queryRest[i].vmaterialId;
            let vpurchase_org_id = queryRest[i].vpurchaseOrgId;
            let vprice_validate = new Date(queryRest[i].vpriceValidate).getTime();
            let key = vmaterialId + vpurchase_org_id;
            if (undefined != productpricemap.get(key) && null != productpricemap.get(key)) {
              let tempres = productpricemap.get(key);
              let temdate = new Date(tempres.vpriceValidate).getTime();
              if (vprice_validate > temdate) {
                productpricemap.set(key, queryRest[i]);
              }
            } else {
              productpricemap.set(key, queryRest[i]);
            }
          }
        }
        if (productpricemap.size > 0) {
          for (let key of productpricemap.keys()) {
            result.push(productpricemap.get(key));
          }
        }
      }
      return result;
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