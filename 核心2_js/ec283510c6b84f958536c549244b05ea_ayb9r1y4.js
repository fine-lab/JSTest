let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var productionWorkNumber = request.productionWorkNumber;
    // 查询任务下达单的计算公式
    let Formulasql = "select id,jisuangongshi,anzhuangzujiesuanjin from GT102917AT3.GT102917AT3.Taskorderdetailss where shengchangonghao.Productionworknumber = '" + productionWorkNumber + "'";
    let FormulaRes = ObjectStore.queryByYonQL(Formulasql);
    return { FormulaRes };
  }
}
exports({ entryPoint: MyAPIHandler });