let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var idnumber = param.convBills[0].id;
    var transTypeIdValue = param.convBills[0].transTypeId; //交易类型
    if ("2550020265336107" == transTypeIdValue) {
      let func1 = extrequire("ST.useAPI.undoData");
      var request = { idnumber: idnumber };
      let res = func1.execute(request);
      if (res.bodyres == null) {
        throw new Error(res);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });