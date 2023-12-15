let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var type = request.type; //状态
    var role = request.role; //1 收货人 2 库管员 3司机 4销售人员
    var name = request.name; //姓名
    var phone = request.phone; //客户电话
    var sql;
    var condition = "";
    if (role == 1) {
      //收货人
      condition += " and receiveContacterPhone = '" + phone + "'";
    } else if (role == 2) {
      //库管员
      condition = " and FaXiangRenPhone = '" + phone + "'";
    } else if (role == 3) {
      condition = " and DriverPhone = '" + phone + "'";
    } else if (role == 4) {
      condition = " and YeWuYuan = '" + name + "'";
    }
    if (type == 2) {
      //运输中装箱单
      sql = "select count(id) from GT37846AT3.GT37846AT3.RZH_11 where QianShouRen = '未签收'" + condition + " order by createTime desc";
    } else if (type == 3) {
      //已签名装箱单
      sql = "select count(id) from GT37846AT3.GT37846AT3.RZH_11 where not QianShouRen = '未签收'" + condition + " order by createTime desc";
    }
    var res = ObjectStore.queryByYonQL(sql);
    return { data: res, sql: sql };
  }
}
exports({ entryPoint: MyAPIHandler });