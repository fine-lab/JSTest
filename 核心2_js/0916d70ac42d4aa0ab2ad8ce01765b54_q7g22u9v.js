let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前时间毫秒值
    let nowTime = new Date().getTime();
    // 获取客户档案id
    let agentId = request.agentId;
    // 通过YonQL查询客户资质效期
    let dSql = "select * from aa.merchant.CustomerDefine where merchantId = '" + agentId + "'";
    let dId = ObjectStore.queryByYonQL(dSql, "productcenter");
    // 客户资质效期时间
    let ctmTime = new Date(dId[0].customerDefine2).getTime();
    // 通过自定义项中的资质效期和当前时间进行比较，如果资质效期合法则返回true,否则返回false
    if (ctmTime < nowTime) {
      return { checked: false };
    } else {
      return { checked: true };
    }
  }
}
exports({ entryPoint: MyAPIHandler });