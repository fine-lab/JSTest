let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取插入参数
    var prov = request.prov;
    var city = request.city;
    //拼接SQL语句
    var sql = "select distinct vcounty from AT15B24E9C16C80002.AT15B24E9C16C80002.pcc_pfy where vprov='" + prov + "' and vcity='" + city + "'";
    //执行sql语句
    var res = ObjectStore.queryByYonQL(sql);
    //返回值
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });