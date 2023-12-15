let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var value1 = request.xingming;
    var value2 = request.lianxifangshi;
    var value3 = request.koling;
    var pd = true;
    var p1 = [];
    //查询人员表是否存在
    var sql1 = "select * from GT65548AT19.GT65548AT19.text_hzyV2_4_1 where name = '" + value1 + "' and iphone ='" + value2 + "' and new8 ='" + value3 + "'";
    var sql2 = "select * from GT65548AT19.GT65548AT19.text_hzyV2_12 where kouling = '" + value3 + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    var res2 = ObjectStore.queryByYonQL(sql2);
    return { msg: "查询成功", res1: value3, res2: res2 };
  }
}
exports({ entryPoint: MyAPIHandler });