let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取省份传参
    var vprov = request.prov;
    //拼接SQL语句
    var sql = "select distinct vcity from AT15B24E9C16C80002.AT15B24E9C16C80002.pcc_pfy where vprov='" + vprov + "'";
    //执行sql语句
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });