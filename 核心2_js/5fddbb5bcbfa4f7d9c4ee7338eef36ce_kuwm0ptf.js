let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      // 获取收入 主营业务+其他业务收入
      let funcIncome = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resIncome = funcIncome.execute(context);
      // 获取收入 主营业务+其他业务收入
      let func = extrequire("AT17AF88F609C00004.operatingincome.getIncomeAll");
      let resObject = func.execute(context, resIncome, context.codes).resObject;
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getCommonIncome报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });