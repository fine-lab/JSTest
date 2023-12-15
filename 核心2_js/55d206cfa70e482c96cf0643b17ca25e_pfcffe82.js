let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查询档案已经存储的客户与物料，通过关联关系取得相应的数据返回到前台进行数据填充
    let { custIds, marIds } = request;
    var result = {};
    if (custIds && custIds.length > 0) {
      let custWherePart = "(" + custIds.join("','") + ")";
      var res0 = ObjectStore.queryByYonQL("select distinct merchant,merchant.code,merchant.name from GT7239AT6.GT7239AT6.cmmssn_cust_mar_c where merchant in " + custWherePart);
      result.cust = res0;
    }
    if (marIds && marIds.length > 0) {
      let marWherePart = "(" + marIds.join("','") + ")";
      var res1 = ObjectStore.queryByYonQL("select distinct product,product.code,product.name from GT7239AT6.GT7239AT6.cmmssn_cust_mar_m where product in " + marWherePart);
      result.mar = res1;
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });