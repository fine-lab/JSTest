let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取插入参数
    var bintl = request.bintl;
    //拼接SQL语句
    var sql = "select distinct vprov from AT1643171016E80005.AT1643171016E80005.quyu_pfy where bintl='" + bintl + "'";
    //执行sql语句,获得查询结果
    var res = ObjectStore.queryByYonQL(sql);
    //返回值
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });