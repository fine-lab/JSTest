let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //定义request对象
    let request = {
      synDate: param.synDate
    };
    let func = extrequire("AT1672920C08100005.costApi.prepayCancelApi");
    let res = func.execute(request);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });