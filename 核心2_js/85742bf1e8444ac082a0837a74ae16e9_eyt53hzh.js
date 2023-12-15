let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code;
    var role = request.role;
    var name = request.name;
    var phone = request.phone;
    var condition = "";
    if (role == 1) {
      //收货人
      condition += " and receiveContacterPhone = '" + phone + "'";
    } else if (role == 2) {
      //发箱人
    }
    var sql = "select * from GT37846AT3.GT37846AT3.RZH_11 where code = '" + code + "'" + condition;
    var res = ObjectStore.queryByYonQL(sql);
    return { data: res, sql: sql };
  }
}
exports({ entryPoint: MyAPIHandler });