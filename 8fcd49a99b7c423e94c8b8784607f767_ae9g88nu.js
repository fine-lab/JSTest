let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let masterId = request.masterId;
    let childArr = [];
    //现存量查询
    //查询不合格子表
    let childSql = "select * from GT22176AT10.GT22176AT10.SY01_unqualison7";
    let childRes = ObjectStore.queryByYonQL(childSql);
    //查询物料
    let sql = "select * from pc.product.Product";
    let productInfo = ObjectStore.queryByYonQL(sql, "productcenter");
    for (let i = 0; i < masterId.length; i++) {
      for (let j = 0; j < childRes.length; j++) {
        if (childRes[j].SY01_bad_drugv2_id != masterId[i]) {
          continue;
        }
        for (let k = 0; k < productInfo.length; k++) {
          if (childRes[j].product_code == productInfo[k].id) {
            childRes[j].ypbwm = productInfo[k].standard_code;
            childRes[j].extend_package_specification = productInfo[k].extend_package_specification;
          }
        }
      }
      childArr.push(childRes);
    }
    return { childArr };
  }
}
exports({ entryPoint: MyAPIHandler });