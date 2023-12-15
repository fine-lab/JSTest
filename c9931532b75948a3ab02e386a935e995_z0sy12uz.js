let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取插入参数
    var id = request.id;
    var pubts = request.pubts;
    var endpubts = request.endpubts;
    var pk_region = request.pk_region;
    //拼接SQL语句
    var where = "";
    if (id != null && id != "") {
      where += " where id='" + id + "'";
    }
    if (pk_region != null && pk_region != "") {
      if (where != "") {
        where += " and pk_region='" + pk_region + "'";
      } else {
        where += " where pk_region='" + pk_region + "'";
      }
    }
    if (pubts != null && pubts != "") {
      if (where != "") {
        where += " and pubts>='" + pubts + "' and pubts <='" + endpubts + "'";
      } else {
        where += " where pubts>='" + pubts + "' and pubts <='" + endpubts + "'";
      }
    }
    var sql = "select * from AT15B24E9C16C80002.AT15B24E9C16C80002.quyu_pfy  " + where;
    //执行sql语句,获得查询结果
    var res = ObjectStore.queryByYonQL(sql);
    //返回值
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });