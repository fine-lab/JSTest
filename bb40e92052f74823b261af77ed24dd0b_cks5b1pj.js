let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      var getMonthOnMonth = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      var getYearOnYear = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      //总资产报酬率=（利润总额+利息支出）/平均总资产×100%  660302  利息支出
      var lxzcparam1 = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        period1: context.period1, //起始期间,必填
        period2: context.period2, //结束期间,必填
        codes: ["660302"]
      };
      //同比
      let lxzcparam2 = {
        org: lxzcparam1.org, //会计主体ID,必填
        accbook: lxzcparam1.accbook, // 账簿
        period1: getYearOnYear.execute(lxzcparam1.period1).date, //起始期间,必填
        period2: getYearOnYear.execute(lxzcparam1.period2).date, //结束期间,必填
        codes: ["660302"]
      };
      //环比
      let lxzcparam3 = {
        org: lxzcparam1.org, //会计主体ID,必填
        accbook: lxzcparam1.accbook, // 账簿
        period1: getMonthOnMonth.execute(lxzcparam1.period1).date, //起始期间,必填
        period2: getMonthOnMonth.execute(lxzcparam1.period2).date, //结束期间,必填
        codes: ["660302"]
      };
      let getSubjects = extrequire("AT17AF88F609C00004.common.getSubjects");
      let dataformat = extrequire("AT17AF88F609C00004.common.dataformat");
      //利息支出
      let lxzhichu = getSubjects.execute(lxzcparam1);
      lxzhichu = Array.from(lxzhichu);
      var lixizhichu = 0;
      lxzhichu.forEach((item) => {
        if (item != null) {
          if (item.hasOwnProperty("localdebit2")) {
            lixizhichu += item.localdebit2;
          }
        }
      });
      //去年利息支出
      let lastyearlxzhichu = getSubjects.execute(lxzcparam2);
      lastyearlxzhichu = Array.from(lastyearlxzhichu);
      var lastyearlixizhichu = 0;
      lastyearlxzhichu.forEach((item) => {
        if (item != null) {
          if (item.hasOwnProperty("localdebit2")) {
            lastyearlixizhichu += item.localdebit2;
          }
        }
      });
      //上个月利息支出
      let lastmonthlxzhichu = getSubjects.execute(lxzcparam3);
      lastmonthlxzhichu = Array.from(lastmonthlxzhichu);
      var lastmonthlixizhichu = 0;
      lastmonthlxzhichu.forEach((item) => {
        if (item != null) {
          if (item.hasOwnProperty("localdebit2")) {
            lastmonthlixizhichu += item.localdebit2;
          }
        }
      });
      var lrzeparam1 = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        period1: context.period1, //起始期间,必填
        period2: context.period2 //结束期间,必填
      };
      let lrzeparam2 = {
        org: lrzeparam1.org, //会计主体ID,必填
        accbook: lrzeparam1.accbook, // 账簿
        period1: getYearOnYear.execute(lrzeparam1.period1).date, //起始期间,必填
        period2: getYearOnYear.execute(lrzeparam1.period2).date //结束期间,必填
      };
      let lrzeparam3 = {
        org: lrzeparam1.org, //会计主体ID,必填
        accbook: lrzeparam1.accbook, // 账簿
        period1: getMonthOnMonth.execute(lrzeparam1.period1).date, //起始期间,必填
        period2: getMonthOnMonth.execute(lrzeparam1.period2).date //结束期间,必填
      };
      let getCommonIncome = extrequire("AT17AF88F609C00004.operatingprofit.getCommonProfitH");
      let lrzonge = getCommonIncome.execute(lrzeparam1); //利润总额
      //总利润
      var zonglirun = lrzonge.resObject.resObject.currentPeriod;
      //前年总利润
      var lastyearzonglirun = lrzonge.resObject.resObject.oneYearAgo;
      //上个月总利润
      var lastmonthzonglirun = lrzonge.resObject.resObject.previousPeriod;
      let getCommonAsse = extrequire("AT17AF88F609C00004.AssetsLiabilities.getCommonAsse");
      let zongzichan = getCommonAsse.execute(lrzeparam1); //总资产
      var zichan = zongzichan.res.jingzichan;
      let lastyearzongzichan = getCommonAsse.execute(lrzeparam2); //总资产
      var lastyearzichan = lastyearzongzichan.res.jingzichan;
      let lastmonthzongzichan = getCommonAsse.execute(lrzeparam3); //总资产
      var lastmonthzichan = lastmonthzongzichan.res.jingzichan;
      var res = {
        RateOfPay: dataformat.execute(((lixizhichu + zonglirun) / zichan) * 100).res,
        yeartoyear: dataformat.execute(((lastyearlixizhichu + lastyearzonglirun) / lastyearzichan) * 100).res,
        monthtomonth: dataformat.execute(((lastmonthlixizhichu + lastmonthzonglirun) / lastmonthzichan) * 100).res
      };
      return { res };
    } catch (e) {
      throw new Error(e);
    }
  }
}
exports({ entryPoint: MyTrigger });