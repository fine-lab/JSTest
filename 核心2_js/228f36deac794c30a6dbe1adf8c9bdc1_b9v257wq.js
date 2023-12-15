let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let res = { code: 200 };
    //记录调用记录日志
    try {
      res.data = ObjectStore.insert("AT18623B800920000A.AT18623B800920000A.apiLog", request, "ybffcba2f2");
      console.log(JSON.stringify(res.data));
    } catch (e) {
      res.code = 999;
      res.msg = "调用异常" + e.toString();
    } finally {
      return res;
    }
  }
}
exports({ entryPoint: MyAPIHandler });