let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var scgh = request.SC;
    var type = request.advanceType;
    if (type == "1") {
      var sql1 = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails where Productionworknumber = '" + scgh + "'";
      var res1 = ObjectStore.queryByYonQL(sql1);
      var id = res1[0].id;
      var sql = "select anzhuangzujiesuanjin from GT102917AT3.GT102917AT3.Taskorderdetailss where shengchangonghao = '" + id + "'"; // where shengchangonghao ='"+id+"'"
      var res = ObjectStore.queryByYonQL(sql);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });