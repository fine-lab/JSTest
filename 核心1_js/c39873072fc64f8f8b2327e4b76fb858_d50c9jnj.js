let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let env = ObjectStore.env();
    let serviceCode = "";
    if (env.tenantId == "d50c9jnj") {
      // 生产-贵州中融信通科技有限公司
      serviceCode = "1710388597649047553"; //物流状态的serviceCode
    } else if (env.tenantId == "gx6eogib") {
      // 贵州数算互联科技有限公司
      serviceCode = "1710397136044032004"; //物流状态的serviceCode
    } else if (env.tenantId == "rz296oih") {
      // 测试-贵州中融信通科技有限公司
      serviceCode = "1702323130116079620"; //物流状态的serviceCode
    }
    return { serviceCode: serviceCode };
  }
}
exports({ entryPoint: MyAPIHandler });