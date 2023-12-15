let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code;
    var role = request.role;
    var name = request.name;
    var phone = request.phone;
    var rhz01_id = request.rhz01_id;
    var condition = " and verifystate = 2 ";
    var sql = "";
    if (role == 1) {
      //收货人
      condition += " and CusContactnumber = '" + phone + "'";
    } else if (role == 2) {
      //库管员
    } else if (role == 3) {
      //司机
    }
    var sql = "select * from AT175A93621C400009.AT175A93621C400009.rzh01 where code = '" + code + "'" + condition; //单个签收人
    var res = ObjectStore.queryByYonQL(sql);
    return { data: res, sql: sql };
  }
}
exports({ entryPoint: MyAPIHandler });