let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    console.error("错误95c7e8f4bf094c628c946f25d86987c3" + 4);
    let pdata = param.data[0];
    let youXiangJiaoYan = pdata.youXiangJiaoYan;
    let xunPanLeiXing = pdata.xunPanLeiXing;
    if ((xunPanLeiXing == "1" || xunPanLeiXing == "7") && includes(youXiangJiaoYan, "有重复数据")) {
      //询盘类型 1 自我开发
      throw new Error("自开发客户&&地推陌拜--不允许重复询盘线索录入！");
    }
    if (includes(youXiangJiaoYan, "不允许录入")) {
      throw new Error(youXiangJiaoYan);
    }
    console.error("错误95c7e8f4bf094c628c946f25d86987c3" + 14);
    return {};
  }
}
exports({ entryPoint: MyTrigger });