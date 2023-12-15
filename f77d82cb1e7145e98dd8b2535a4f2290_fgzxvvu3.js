//获取原厂物料创建（物料档案）： 1、物料的检验属性是检验； 2、根据检验结果入库是“是”； 的所有数据
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
    let str_mIdArr = mIdArr.join(",");
    let yonql = "select * from pc.product.ProductApplyRange where productId in (" + str_mIdArr + ") and orgId = '" + request.orgId + "'";
    let res = ObjectStore.queryByYonQL(yonql, "productcenter");
    let proDetailIdArr = [];
    if (res.length > 0) {
      for (let i = 0; i < res.length; i++) {
        proDetailIdArr.push(res[i].productDetailId);
      }
    }
    let str_proDetailIdArr = proDetailIdArr.join(",");
    let proChildSql = "select * from pc.product.ProductDetail where id in (" + str_proDetailIdArr + ")";
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