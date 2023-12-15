let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code;
    var object = { servbill_no: code };
    var res = ObjectStore.insert("AT18882E1616F80005.AT18882E1616F80005.servbill", object, "servbill");
    if (res != null) {
      var billID = res.id;
      if (billID != null) {
        //调用工作流
        let wfobj = { id: billID };
        let detail = ObjectStore.selectById("AT18882E1616F80005.AT18882E1616F80005.servbill", wfobj);
        let data = { billnum: "servbill", data: JSON.stringify(detail) };
        let res1 = ObjectStore.execute("submit", data);
        //调用工作流结束
        return { data: res1 };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });