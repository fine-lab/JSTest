let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data.productionId;
    //根据生产工号查询附加明细详情表
    var sql = "select additionAmount from GT102917AT3.GT102917AT3.additionalConditionDetails where productionWorkNumber = '" + data + "' ";
    var resultList = ObjectStore.queryByYonQL(sql);
    return { resultList };
  }
}
exports({ entryPoint: MyAPIHandler });