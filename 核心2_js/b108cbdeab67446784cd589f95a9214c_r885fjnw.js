let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //调用获取token方法  access_token
    let tokenFun = extrequire("AT164059BE09880007.frontDesignerFunction.TestApi");
    let tokenResult = tokenFun.execute();
    let access_token = tokenResult.access_token;
    return tokenResult;
  }
}
exports({ entryPoint: MyTrigger });