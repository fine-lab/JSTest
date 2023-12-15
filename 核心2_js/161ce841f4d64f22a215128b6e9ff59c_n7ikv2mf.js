let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var log = { billName: "合同变更", operation: "保存", ziduan1: "更新合同状态", logLevel: "info", content: JSON.stringify(param) };
    let logfunc1 = extrequire("GT33423AT4.backDefaultGroup.TestLog");
    let res1 = logfunc1.execute(log);
    //变更中
    var object = { id: param.data[0].source_id, changeStatus: "2" };
    var res = ObjectStore.updateById("GT27606AT15.GT27606AT15.HBHTGL", object);
    var log2 = { billName: "合同变更", operation: "保存", ziduan1: "更新合同状态", logLevel: "info", content: JSON.stringify(res) };
    let res2 = logfunc1.execute(log2);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });