let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, functionTarget) {
    try {
      // 记录入参的开始和结束期间
      var startPeriod = context.period1;
      var endPeriod = context.period2;
      // 年累计值
      var annualAccumulation = 0;
      let funcAnnualAccumulation = extrequire(functionTarget);
      annualAccumulation = funcAnnualAccumulation.execute(context).income;
      // 本期值
      context.period1 = endPeriod;
      var currentPeriod = 0;
      let funcCurrentPeriod = extrequire(functionTarget);
      currentPeriod = funcCurrentPeriod.execute(context).income;
      // 上期值
      let funcPreviousPeriodDate = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      context.period1 = funcPreviousPeriodDate.execute(endPeriod).date;
      context.period2 = funcPreviousPeriodDate.execute(endPeriod).date;
      var previousPeriod = 0;
      let funcPreviousPeriod = extrequire(functionTarget);
      previousPeriod = funcPreviousPeriod.execute(context).income;
      // 上年同期值
      let funcSamePeriodLastYearDate = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      context.period1 = funcSamePeriodLastYearDate.execute(endPeriod).date;
      context.period2 = funcSamePeriodLastYearDate.execute(endPeriod).date;
      var samePeriodLastYear = 0;
      let funcSamePeriodLastYear = extrequire(functionTarget);
      samePeriodLastYear = funcSamePeriodLastYear.execute(context).income;
      // 获取一年前值
      let funcOneYearAgoDate = new Date(endPeriod).getFullYear() - 1;
      context.period1 = funcOneYearAgoDate + "-01";
      context.period2 = funcOneYearAgoDate + "-12";
      var oneYearAgo = 0;
      let funcOneYearAgo = extrequire(functionTarget);
      oneYearAgo = funcOneYearAgo.execute(context).income;
      // 获取两年前值
      let funcTwoYearAgoDate = new Date(endPeriod).getFullYear() - 2;
      context.period1 = funcTwoYearAgoDate + "-01";
      context.period2 = funcTwoYearAgoDate + "-12";
      var twoYearAgo = 0;
      let funcTwoYearAgo = extrequire(functionTarget);
      twoYearAgo = funcTwoYearAgo.execute(context).income;
      // 获取三年前值
      let funcThreeYearAgoDate = new Date(endPeriod).getFullYear() - 3;
      context.period1 = funcThreeYearAgoDate + "-01";
      context.period2 = funcThreeYearAgoDate + "-12";
      var threeYearAgo = 0;
      let funcThreeYearAgo = extrequire(functionTarget);
      threeYearAgo = funcThreeYearAgo.execute(context).income;
      // 获取四年前值
      let funcFourYearAgoDate = new Date(endPeriod).getFullYear() - 4;
      context.period1 = funcFourYearAgoDate + "-01";
      context.period2 = funcFourYearAgoDate + "-12";
      var fourYearAgo = 0;
      let funcFourYearAgo = extrequire(functionTarget);
      fourYearAgo = funcFourYearAgo.execute(context).income;
      // 环比增长率
      var monthOnMonthGrowthRate = 0;
      if (previousPeriod == 0) {
        monthOnMonthGrowthRate = null;
      } else {
        monthOnMonthGrowthRate = (currentPeriod - previousPeriod) / previousPeriod;
      }
      // 同比增长率
      var yearToYearGrowthRate = 0;
      if (samePeriodLastYear == 0) {
        yearToYearGrowthRate = null;
      } else {
        yearToYearGrowthRate = (currentPeriod - samePeriodLastYear) / samePeriodLastYear;
      }
      // 一年前同比增长率
      var oneYearAgoYearToYearGrowthRate = 0;
      if (twoYearAgo == 0) {
        oneYearAgoYearToYearGrowthRate = null;
      } else {
        oneYearAgoYearToYearGrowthRate = (oneYearAgo - twoYearAgo) / twoYearAgo;
      }
      // 两年前同比增长率
      var twoYearAgoYearToYearGrowthRate = 0;
      if (threeYearAgo == 0) {
        twoYearAgoYearToYearGrowthRate = null;
      } else {
        twoYearAgoYearToYearGrowthRate = (twoYearAgo - threeYearAgo) / threeYearAgo;
      }
      // 三年前同比增长率
      var threeYearAgoYearToYearGrowthRate = 0;
      if (fourYearAgo == 0) {
        threeYearAgoYearToYearGrowthRate = null;
      } else {
        threeYearAgoYearToYearGrowthRate = (threeYearAgo - fourYearAgo) / fourYearAgo;
      }
      // 返回当前指标所有同比环比等相关信息
      var resObject = {
        currentPeriod: currentPeriod,
        annualAccumulation: annualAccumulation,
        previousPeriod: previousPeriod,
        samePeriodLastYear: samePeriodLastYear,
        oneYearAgo: oneYearAgo,
        twoYearAgo: twoYearAgo,
        threeYearAgo: threeYearAgo,
        monthOnMonthGrowthRate: monthOnMonthGrowthRate,
        yearToYearGrowthRate: yearToYearGrowthRate,
        oneYearAgoYearToYearGrowthRate: oneYearAgoYearToYearGrowthRate,
        twoYearAgoYearToYearGrowthRate: twoYearAgoYearToYearGrowthRate,
        threeYearAgoYearToYearGrowthRate: threeYearAgoYearToYearGrowthRate,
        context: context
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getIncomePublic报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });