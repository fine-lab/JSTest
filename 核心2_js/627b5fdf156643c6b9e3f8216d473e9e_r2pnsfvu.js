let AbstractAPIHandler = require("AbstractAPIHandler");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { productId, productApplyRangeId } = request;
    if (!productId || !productApplyRangeId) {
      throw new Error(`物料id字段productId与物料范围id字段productApplyRangeId必须提供。当前值productId={${productId}},productApplyRangeId={${productApplyRangeId}}。`);
    }
    var productRes = {};
    let productUrl = `https://api.diwork.com/yonbip/digitalModel/product/detail?id=${productId}&productApplyRangeId=${productApplyRangeId}`;
    productRes = ublinker("get", productUrl, HEADER_STRING, null);
    productRes = JSON.parse(productRes);
    if (productRes && productRes.data && productRes.data.id) {
      productRes = productRes.data;
      let taxrateUrl = `https://api.diwork.com/yonbip/digitalModel/taxrate/findById?id=${productRes.detail.outTaxrate}`;
      var taxrateJson = ublinker("get", taxrateUrl, HEADER_STRING, null);
      var taxrateRes = JSON.parse(taxrateJson);
      if (taxrateRes && taxrateRes.data && taxrateRes.data.id) {
        taxrateRes = taxrateRes.data;
      }
      let unitUrl = `https://api.diwork.com/yonbip/digitalModel/unit/detail?id=${productRes.unit}`;
      var unitJson = ublinker("get", unitUrl, HEADER_STRING, null);
      var unitRes = JSON.parse(unitJson);
      if (unitRes && unitRes.data && unitRes.data.id) {
        unitRes = unitRes.data;
      }
    }
    return { productRes, taxrateRes, unitRes };
  }
}
exports({ entryPoint: MyAPIHandler });