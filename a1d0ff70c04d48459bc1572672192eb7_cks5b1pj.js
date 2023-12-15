let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(context) {
    try {
      // 获取收入类中所有的科目类别，编码，借贷方向等信息，供后续使用
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(context, "收入类");
      // 定义一个codes的list  用于存放科目编码所有
      var codes = resSubjectType.res.codes;
      // 获取收入 一般来说为主营业务+其他业务收入
      context.codes = codes;
      let funcIncome = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resIncome = funcIncome.execute(context);
      // 获取收入的所有指标信息
      let func = extrequire("AT17AF88F609C00004.operatingincome.getIncomeAll");
      let res = func.execute(context, resIncome, codes);
      let resObject = {
        resIncome: resIncome,
        res: res
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getIncomeCommon报错：" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });