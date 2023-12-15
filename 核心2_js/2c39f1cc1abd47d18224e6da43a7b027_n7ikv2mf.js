let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let param1 = {}; //
    let func = extrequire("AT17E908FC08280001.backDesignerFunction.SynConDetail");
    let res = func.execute(param1);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });