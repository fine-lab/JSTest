let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let envUrl = context;
    //对于客开而言，只有沙箱环境和生产环境
    let sandbox = "dbox.yyuap.com";
    var envParam = "sandbox"; //默认沙箱
    if (enUrl.indexOf(sandbox) == -1) {
      //说明当前环境是生产
      envParam = "production";
    }
    let configParamsFun = extrequire("GT100025AT153.moren.commonParams");
    let configParams = configParamsFun.execute(envParam).currentEnvParams;
    return { configParams };
  }
}
exports({ entryPoint: MyTrigger });