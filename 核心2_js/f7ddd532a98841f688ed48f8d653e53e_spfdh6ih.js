let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //项目id
    var project = request.project;
    //物料id
    var product = request.product;
    //数量
    var qty = request.qty;
    //物料编码
    var productCode = request.productCode;
    //物料名称
    var productName = request.productName;
    //查询关系表主表
    var queryPro = "select id from GT65690AT1.GT65690AT1.prjMaterRelevance where dr=0 and project='" + project + "'";
    var prores = ObjectStore.queryByYonQL(queryPro, "developplatform");
    if (prores.length == 1) {
      //查询关系表子表
      var querySql = "select * from GT65690AT1.GT65690AT1.prjMaterRelevance_a where dr=0 and product='" + product + "' and prjMaterRelevance_id='" + prores[0].id + "'";
      var res = ObjectStore.queryByYonQL(querySql, "developplatform");
      if (res.length == 1) {
        var olduseshuliang = 0;
        if (res[0].useshuliang !== undefined) {
          olduseshuliang = res[0].useshuliang;
        }
        var shuliang = 0;
        if (res[0].shuliang !== undefined) {
          shuliang = res[0].shuliang;
        }
        if (shuliang < olduseshuliang + qty) {
          throw new Error("保存失败，物料编码为【" + productCode + "】、物料名称为【" + productName + "】的【数量】字段值大于对应关系表中【可用数量】字段值！");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });