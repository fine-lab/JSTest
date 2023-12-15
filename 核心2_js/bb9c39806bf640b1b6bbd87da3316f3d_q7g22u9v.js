let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取需要使用的字段
    var { agentId, qty } = param.data[0];
    // 红蓝字判断,数值大于0时为蓝字单据,否则为红色字单据
    var billNum = qty;
    // 若为蓝字单据时，则判断客户资质效期是否合法
    if (billNum > 0) {
      // 获取当前时间毫秒值
      let nowTime = new Date().getTime();
      // 通过YonQL查询客户资质效期
      let dSql = "select * from aa.merchant.CustomerDefine where merchantId ='" + agentId + "'";
      let dId = ObjectStore.queryByYonQL(dSql, "productcenter");
      // 客户资质效期时间
      let ctmTime = new Date(dId[0].customerDefine2).getTime();
      // 通过自定义项中的资质效期和当前时间进行比较,如果资质效期合法则放行,否则拦截弹窗
      if (ctmTime < nowTime) {
        throw new Error("当前客户存在过期资质，请检查");
      } else {
        return {};
      }
      // 若为红字单据，则放行
    } else {
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });