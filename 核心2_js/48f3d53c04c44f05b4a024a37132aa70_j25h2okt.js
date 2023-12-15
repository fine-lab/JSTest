let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data;
    if (Data.length > 0) {
      for (let i = 0; i < Data.length; i++) {
        var id = Data[i].id;
        // 调用公共方法
        let param1 = { context: "12312" };
        let param2 = { id: id, state: "Audit" };
        let func = extrequire("ST.unit.allotPublicAudit");
        let kpl = func.execute(param1, param2);
        var body = kpl.returnList.body;
        let header = { "Content-Type": "application/json;charset=UTF-8" };
        let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
        let str = JSON.parse(strResponse);
        throw new Error(JSON.stringify(str));
        if (str.success != true) {
          throw new Error("调用OMS调拨计划单API失败！");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });