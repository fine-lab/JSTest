let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //根据物料的model查询物料的主键
    let allProductCode = request.allProductCode;
    let inSqlCondition = "('" + allProductCode.join("','") + "')";
    let querySql = "select id,model,code  from pc.product.Product  where code in " + inSqlCondition + "";
    var res = ObjectStore.queryByYonQL(querySql, "productcenter");
    let productMap = {};
    if (res && res.length > 0) {
      for (let i = 0; i < res.length; i++) {
        let temp = res[i].code;
        productMap[temp] = res[i].model;
      }
    }
    return { productMap };
  }
}
exports({ entryPoint: MyAPIHandler });