let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取生产工号
    var number = request.number;
    //定义变量
    var sum1 = 0;
    //根据生产工号查询任务下达单
    var sql1 = "select anzhuangzujiesuanjin from GT102917AT3.GT102917AT3.Taskorderdetails where shengchangonghao='" + number + "'";
    var res = ObjectStore.queryByYonQL(sql1);
    if (res.length > 0) {
      var ww = res[0].anzhuangzujiesuanjin;
      sum1 = ww + sum1;
    }
    return { sum1 };
  }
}
exports({ entryPoint: MyAPIHandler });