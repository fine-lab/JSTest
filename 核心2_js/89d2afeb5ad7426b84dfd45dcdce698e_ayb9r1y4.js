let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var scgh = request.SC;
    //查询分包合同
    var sql1 = "select productionWorkNumber from GT102917AT3.GT102917AT3.subcontractDetails where id = '" + scgh + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    //查询安装合同
    var sql2 = "select id from GT102917AT3.GT102917AT3.BasicInformationDetails where Productionworknumber = '" + res1[0].productionWorkNumber + "'";
    var res2 = ObjectStore.queryByYonQL(sql2);
    //查询任务下达单
    var sql = "select shengchangonghao,jisuangongshi from GT102917AT3.GT102917AT3.Taskorderdetailss where shengchangonghao = '" + res2[0].id + "'";
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });