let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    var period1 = context.period1;
    var period2 = context.period2;
    let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
    let resSubjectType = funcSubjectType.execute(context, "资产负债类");
    //负债codes
    var liabilityCodes = resSubjectType.res.allType["资产负债类负债"].codeCredit;
    context.codes = liabilityCodes;
    return {};
  }
}
exports({ entryPoint: MyTrigger });