let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productId = request.productId;
    let otherReportArr = [];
    //查询医药物料主表
    let productMSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where material = " + productId;
    let productMRes = ObjectStore.queryByYonQL(productMSql, "sy01");
    if (productMRes.length > 0) {
      for (let i = 0; i < productMRes.length; i++) {
        otherReportArr.push(productMRes[i].id);
      }
    }
    return { otherReportArr };
  }
}
exports({ entryPoint: MyAPIHandler });