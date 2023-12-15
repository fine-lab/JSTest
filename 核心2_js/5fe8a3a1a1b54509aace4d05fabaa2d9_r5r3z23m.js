let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request._orgId;
    let productConditions = request._productConditions;
    let sql = "select shelvesData,shelvesData.shelvesName as shelvesName ,warehouse,baseOrg,product from GT2152AT10.GT2152AT10.productShelves";
    sql += " where product in (" + productConditions + ") and baseOrg = '" + orgId + "'";
    let res = ObjectStore.queryByYonQL(sql, "developplatform"); //因为是调用标准版构建的应用，所以必须传递第二个参数：developplatform
    let resMap = {};
    for (let i = 0; i < res.length; i++) {
      resMap[res[i].baseOrg + res[i].warehouse + res[i].product] = res[i];
    }
    return { res: resMap };
  }
}
exports({ entryPoint: MyAPIHandler });