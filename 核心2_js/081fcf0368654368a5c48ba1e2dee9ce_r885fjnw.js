let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let envUrl = context;
    //对于客开而言，只有沙箱环境（商用开发环境）和生产环境
    //调用公共参数
    let configParamsFun = extrequire("AT1832AE3609F80004.openApi.commonParams");
    let configParams = configParamsFun.execute(envParam).currentEnvParams;
    return { configParams };
  }
}
exports({ entryPoint: MyTrigger });