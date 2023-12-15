let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data;
    if (Data.length > 0) {
      for (let i = 0; i < Data.length; i++) {
        var id = Data[i].id;
        // 调用公共方法
        let param1 = { context: "12312" };
        let param2 = { id: id, state: "UnAudit" };
        let func = extrequire("ST.unit.allotPublicAudit");
        let kpl = func.execute(param1, param2);
        var body = kpl.returnList.body;
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });