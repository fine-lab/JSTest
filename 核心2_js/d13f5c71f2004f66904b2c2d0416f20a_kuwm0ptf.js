let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let user = request.user;
    //查询内容
    if (id == null && user == null) {
      throw new Error("参数为空");
    }
    var sql = "select id,user,name,total,checkedlist,createTime from AT18E626C409D80003.AT18E626C409D80003.saleLog where dr = 0 ";
    if (id != null && id != undefined && id != "") {
      sql += " and id = " + id;
    }
    if (user != null && user != undefined && user != "") {
      sql += " and user = '" + user + "'";
    }
    sql += " order by createTime desc limit 100 ";
    var res = ObjectStore.queryByYonQL(sql);
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });