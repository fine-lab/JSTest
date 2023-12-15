let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let envUrl = context;
    // 对于客开而言，只有沙箱环境和生产环境
    let sandbox = "c2.yonyoucloud.com";
    let envParam = "sandbox"; // 默认沙箱
    if (envUrl.indexOf(sandbox) == -1) {
      // 说明当前环境是生产
      envParam = "production";
    }
    // 调用公共参数
    let configParamsFun = extrequire("AT164B201408C00003.backOpenApiFunction.lxltest");
    let configParams = configParamsFun.execute(envParam).currentEnvParams;
    return { configParams };
  }
}
exports({ entryPoint: MyTrigger });