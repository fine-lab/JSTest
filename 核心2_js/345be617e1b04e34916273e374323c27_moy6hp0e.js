let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let msg; //接口返回状态信息
    let dt; //sql查询返回的对象
    try {
      dt = ObjectStore.queryByYonQL(request.sql, request.key);
      msg = dt;
    } catch (e) {
      msg = e.toString();
    }
    return {
      msg
    };
  }
}
exports({ entryPoint: MyAPIHandler });