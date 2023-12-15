let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    var getMonthOnMonth = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
    var getYearOnYear = extrequire("AT17AF88F609C00004.common.getYearOnYear");
    //总资产收益率=(净利润/平均资产总额)×100%，
    var param2 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: context.period1, //起始期间,必填
      period2: context.period2, //结束期间,必填
      codes: ["6001", "6051"]
    };
    let param3 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: getYearOnYear.execute(context.period1).date, //起始期间,必填
      period2: getYearOnYear.execute(context.period2).date //结束期间,必填
    };
    let param4 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: getMonthOnMonth.execute(context.period1).date, //起始期间,必填
      period2: getMonthOnMonth.execute(context.period2).date //结束期间,必填
    };
    let getCommonProfit = extrequire("AT17AF88F609C00004.pubmoney.getCommonProfit");
    let jinglirun = getCommonProfit.execute(param2);
    let getCommonAsse = extrequire("AT17AF88F609C00004.AssetsLiabilities.getCommonAsse");
    let zongzichan = getCommonAsse.execute(context); //总资产
    let lastyearzongzichan = getCommonAsse.execute(param3);
    let lastmonthzongzichan = getCommonAsse.execute(param4);
    // 计算总资产收益率
    var lirun = jinglirun.resObject.currentPeriod;
    var lastyearlirun = jinglirun.resObject.oneYearAgo;
    var lastmonthlirun = jinglirun.resObject.previousPeriod;
    var zichan = zongzichan.res.jingzichan;
    var lastyearzichan = lastyearzongzichan.res.jingzichan;
    var lastmonthzichan = lastmonthzongzichan.res.jingzichan;
    let dataformat = extrequire("AT17AF88F609C00004.common.dataformat");
    var res = {
      yieldrate: dataformat.execute((lirun / zichan) * 100).res,
      yearonyear: dataformat.execute((lastyearlirun / lastyearzichan) * 100).res,
      monthonmonth: dataformat.execute((lastmonthlirun / lastmonthzichan) * 100).res
    };
    return { res };
  }
}
exports({ entryPoint: MyTrigger });