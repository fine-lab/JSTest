let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(param) {
    let priceList = param.priceList; //2560383351429120     //2560383345055744
    let currency = param.currency; //G001ZM0000DEFAULTCURRENCT00000000001   //G001ZM0000DEFAULTCURRENCT00000000001
    let product = param.product.toString(); //2587168729764609     //2543368045465856
    let date = param.date; //2022-05-24           //2022-05-24
    let productString = "";
    if (product == null || product.length == 0) {
      productString = "('')";
    }
    productString = "('" + replace(product, ",", "','") + "')";
    let queryId =
      "select id,product,startDate from GT71806AT2.GT71806AT2.salePriceListLine inner join GT71806AT2.GT71806AT2.salePriceList t1 on salePriceList_id=t1.id where t1.verifystate=2 and t1.currency='" +
      currency +
      "' and product in " +
      productString +
      " and priceList='" +
      priceList +
      "' and startDate <= '" +
      date +
      "' and endDate >= '" +
      date +
      "' order by startDate DESC";
    let idsData = ObjectStore.queryByYonQL(queryId, "developplatform");
    let ids = [];
    idsData.forEach((iddata) => {
      ids.push(iddata.id);
    });
    let idsString = ids.toString();
    let idsStr = "";
    if (idsString == null || idsString.length == 0) {
      idsStr = "('')";
    }
    idsStr = "('" + replace(idsString, ",", "','") + "')";
    let productDate = [];
    if (idsStr.length != 0) {
      let queryDate = "select product,max(startDate) startDate from GT71806AT2.GT71806AT2.salePriceListLine where id in %s group by product";
      queryDate = replace(queryDate, "%s", idsStr);
      productDate = ObjectStore.queryByYonQL(queryDate, "developplatform");
    }
    //全部
    let productLimit = [];
    if (productDate && productDate.length > 0) {
      productDate.forEach((proDate) => {
        let query = "select lowerLimit,product from GT71806AT2.GT71806AT2.salePriceListLine where product=%p and startDate='%d' and id in %s";
        query = replace(query, "%s", idsStr);
        query = replace(query, "%p", proDate.product);
        query = replace(query, "%d", proDate.startDate);
        let limit = ObjectStore.queryByYonQL(query, "developplatform");
        productLimit = productLimit.concat(limit);
      });
    }
    //超时
    return productLimit;
  }
}
exports({ entryPoint: MyTrigger });