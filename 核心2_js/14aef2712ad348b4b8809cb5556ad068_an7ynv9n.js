let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 先做查询
    let querysql = "select * from GT80750AT4.GT80750AT4.ysorder where  ysbodyid = " + request.ysbodyid + "";
    let res = ObjectStore.queryByYonQL(querysql, "developplatform");
    throw new Error(JSON.stringify(res));
  }
}
exports({ entryPoint: MyAPIHandler });