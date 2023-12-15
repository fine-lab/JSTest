let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let youXiangJiaoYan = pdata.youXiangJiaoYan;
    let xunPanLeiXing = pdata.xunPanLeiXing;
    if (xunPanLeiXing == "1" && includes(youXiangJiaoYan, "有重复数据")) {
      //询盘类型 1 自我开发
      throw new Error("自开发客户--不允许重复询盘线索录入！");
    }
    if (includes(youXiangJiaoYan, "不允许录入")) {
      throw new Error(youXiangJiaoYan);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });