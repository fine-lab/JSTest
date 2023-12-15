let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //项目id
    var project = request.projectId;
    //物料id
    var product = request.productId;
    var returnMap = new Map();
    //查询关系表主表
    var queryPro = "select id from GT65690AT1.GT65690AT1.prjMaterRelevance where dr=0 and project='" + project + "'";
    var prores = ObjectStore.queryByYonQL(queryPro, "developplatform");
    if (prores.length == 1) {
      //查询关系表子表
      var querySql = "select * from GT65690AT1.GT65690AT1.prjMaterRelevance_a where dr=0 and product='" + product + "' and prjMaterRelevance_id='" + prores[0].id + "'";
      var res = ObjectStore.queryByYonQL(querySql, "developplatform");
      if (res.length == 1) {
        var shuliang = res[0].shuliang;
        var useshuliang = res[0].useshuliang;
        var surplus = shuliang - useshuliang;
        returnMap = { shuliang, useshuliang, surplus };
        return returnMap;
      }
    }
    return { returnMap };
  }
}
exports({ entryPoint: MyAPIHandler });