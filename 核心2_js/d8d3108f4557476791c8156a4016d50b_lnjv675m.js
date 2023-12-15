let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //条件对象Key值
    let condition = Object.keys(request)[0];
    //条件对象value值
    let conditionValue = Object.values(request)[0];
    let sql = "select * from GT35175AT8.GT35175AT8.HyFund_cut	where " + condition + " = " + conditionValue;
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });