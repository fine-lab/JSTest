let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
    let resSubjectType = funcSubjectType.execute(context, "资产负债类");
    //获取计算结果
    let getCalculation = extrequire("AT17AF88F609C00004.AssetsLiabilities.getCalculation");
    //数据格式转换
    let dataformat = extrequire("AT17AF88F609C00004.common.dataformat");
    //获取所有的code
    var codes = resSubjectType.res.codes;
    context.codes = codes;
    //资产codes
    var assetCodes = resSubjectType.res.allType["资产负债类资产"].codeDebit;
    //负债codes
    var liabilityCodes = resSubjectType.res.allType["资产负债类负债"].codeCredit;
    var param1 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: context.period1, //起始期间,必填
      period2: context.period2, //结束期间,必填
      codes: codes
    };
    let func = extrequire("AT17AF88F609C00004.common.getSubjects");
    let response = func.execute(param1);
    var zichanList = assetCodes; //资产
    var fuzhaiList = liabilityCodes; //负债
    var zichanzonge = 0;
    var fuzhaizonge = 0;
    response.forEach((item) => {
      if (zichanList.includes(item.accsubject_code)) {
        var zichan = item.localdebit2 - item.localcredebit2;
        zichanzonge += zichan;
      }
      if (fuzhaiList.includes(item.accsubject_code)) {
        var fuzhai = item.localcredebit2 - item.localdebit2;
        fuzhaizonge += fuzhai;
      }
    });
    var jingzichan = zichanzonge - fuzhaizonge;
    var res = {
      zichan: zichanzonge,
      fuzhai: fuzhaizonge,
      jingzichan: jingzichan
    };
    return { res };
  }
}
exports({ entryPoint: MyTrigger });