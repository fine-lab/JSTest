let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let envUrl = context;
    //对于客开而言，只有沙箱环境（商用开发环境）和生产环境
    let sandbox = "dbox.diwork.com";
    var envParam = "sandbox"; //默认沙箱
    if (envUrl.indexOf(sandbox) == -1) {
      //说明当前环境是生产
      envParam = "production";
    }
    //调用公共参数
    let configParamsFun = extrequire("AT1598793A09B00005.openAPI.commonParams");
    let configParams = configParamsFun.execute(envParam).currentEnvParams;
    return { configParams };
  }
}
exports({ entryPoint: MyTrigger });