let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let proIds = [];
    let yonql = "select * from pc.product.ProductApplyRange where orgId = '" + request.orgId + "'";
    let res = ObjectStore.queryByYonQL(yonql, "productcenter");
    let proDetailIdArr = [];
    if (typeof res != "undefined" && res.length > 0) {
      for (let i = 0; i < res.length; i++) {
        proDetailIdArr.push(res[i].productId);
      }
    }
    if (typeof request.supplierId != "undefined" && request.supplierId != null) {
      let str_proDetailIdArr = proDetailIdArr.join(",");
      let proChildSql = "select * from pc.product.ProductDetail where productId in (" + str_proDetailIdArr + ")"; //productVendor = " + request.supplierId + " and
      let proChildRes = ObjectStore.queryByYonQL(proChildSql, "productcenter");
      if (typeof proChildRes != "undefined" && proChildRes != null && proChildRes.length > 0) {
        for (let i = 0; i < proChildRes.length; i++) {
          proIds.push(proChildRes[i].productId);
        }
      }
      return { proIds: proIds };
    } else {
      return { proIds: proDetailIdArr };
    }
  }
}
exports({ entryPoint: MyAPIHandler });