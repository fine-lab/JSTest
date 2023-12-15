let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let staffUrl = DOMAIN + "/yonbip/scm/stock/QueryCurrentStocksByCondition";
    let currentQty = 0;
    let body = { org: request.org, warehouse: request.warehouse, product: request.product };
    let apiRes = openLinker("POST", staffUrl, "GT3734AT5", JSON.stringify(body)); //HRED
    let resObj = JSON.parse(apiRes);
    if (resObj.code == 200 && resObj.data != null && resObj.data.length > 0) {
      let kcList = resObj.data;
      for (var i in kcList) {
        let kcObj = kcList[i];
        currentQty = currentQty + kcObj.currentqty;
      }
    }
    return { currentqty: currentQty, data: apiRes };
  }
}
exports({ entryPoint: MyAPIHandler });