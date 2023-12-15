let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let proMasterSql = "select * from pc.product.Product";
    let proMasterRes = ObjectStore.queryByYonQL(proMasterSql, "productcenter");
    let mIdArr = [];
    if (typeof proMasterRes != "undefined" && proMasterRes != null && proMasterRes.length > 0) {
      for (let i = 0; i < proMasterRes.length; i++) {
        let mId = proMasterRes[i].id;
        mIdArr.push(mId);
      }
    }
    let proChildSql = "select * from pc.product.ProductDetail"; // where productId in (" + str_mIdArr + ")
    let proChildRes = ObjectStore.queryByYonQL(proChildSql, "productcenter");
    let proMastIdArr = [];
    if (typeof proChildRes != "undefined" && proChildRes != null && proChildRes.length > 0) {
      for (let i = 0; i < proChildRes.length; i++) {
        let productId = proChildRes[i].productId;
        if ((proChildRes[i].inspectionType == "1" || proChildRes[i].inspectionType == 1) && (proChildRes[i].warehousingByResult == "true" || proChildRes[i].warehousingByResult == true)) {
          proMastIdArr.push(productId);
        }
      }
    }
    let mIdRes = [];
    for (let i = 0; i < mIdArr.length; i++) {
      for (let j = 0; j < proMastIdArr.length; j++) {
        if (mIdArr[i] == proMastIdArr[j]) {
          mIdRes.push(mIdArr[i]);
          break;
        }
      }
    }
    return { mIdRes };
  }
}
exports({ entryPoint: MyAPIHandler });