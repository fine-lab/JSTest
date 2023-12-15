let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      // 记录入参的开始和结束期间
      var startPeriod = context.period1;
      var endPeriod = context.period2;
      var functionTarget = "AT17AF88F609C00004.common.getSubjects";
      // 年累计值
      let funcAnnualAccumulation = extrequire(functionTarget);
      var annualAccumulation = funcAnnualAccumulation.execute(context);
      // 本期值
      context.period1 = endPeriod;
      let funcCurrentPeriod = extrequire(functionTarget);
      var currentPeriod = funcCurrentPeriod.execute(context);
      // 上期值
      let funcPreviousPeriodDate = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      context.period1 = funcPreviousPeriodDate.execute(endPeriod).date;
      context.period2 = funcPreviousPeriodDate.execute(endPeriod).date;
      let funcPreviousPeriod = extrequire(functionTarget);
      var previousPeriod = funcPreviousPeriod.execute(context);
      // 上年同期值
      let funcSamePeriodLastYearDate = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      context.period1 = funcSamePeriodLastYearDate.execute(endPeriod).date;
      context.period2 = funcSamePeriodLastYearDate.execute(endPeriod).date;
      let funcSamePeriodLastYear = extrequire(functionTarget);
      var samePeriodLastYear = funcSamePeriodLastYear.execute(context);
      // 上年同期累计值
      let funcSamePeriodLastYearAccumulationDate = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      context.period1 = funcSamePeriodLastYearAccumulationDate.execute(startPeriod).date;
      context.period2 = funcSamePeriodLastYearAccumulationDate.execute(endPeriod).date;
      let funcSamePeriodLastYearAccumulation = extrequire(functionTarget);
      var samePeriodLastYearAccumulation = funcSamePeriodLastYearAccumulation.execute(context);
      // 获取一年前值
      let funcOneYearAgoDate = new Date(endPeriod).getFullYear() - 1;
      context.period1 = funcOneYearAgoDate + "-01";
      context.period2 = funcOneYearAgoDate + "-12";
      let funcOneYearAgo = extrequire(functionTarget);
      var oneYearAgo = funcOneYearAgo.execute(context);
      // 获取两年前值
      let funcTwoYearAgoDate = new Date(endPeriod).getFullYear() - 2;
      context.period1 = funcTwoYearAgoDate + "-01";
      context.period2 = funcTwoYearAgoDate + "-12";
      let funcTwoYearAgo = extrequire(functionTarget);
      var twoYearAgo = funcTwoYearAgo.execute(context);
      // 获取三年前值
      let funcThreeYearAgoDate = new Date(endPeriod).getFullYear() - 3;
      context.period1 = funcThreeYearAgoDate + "-01";
      context.period2 = funcThreeYearAgoDate + "-12";
      let funcThreeYearAgo = extrequire(functionTarget);
      var threeYearAgo = funcThreeYearAgo.execute(context);
      // 获取四年前值
      let funcFourYearAgoDate = new Date(endPeriod).getFullYear() - 4;
      context.period1 = funcFourYearAgoDate + "-01";
      context.period2 = funcFourYearAgoDate + "-12";
      let funcFourYearAgo = extrequire(functionTarget);
      var fourYearAgo = funcFourYearAgo.execute(context);
      // 返回当前指标所有同比环比等相关信息
      var resObject = {
        currentPeriod: currentPeriod,
        annualAccumulation: annualAccumulation,
        previousPeriod: previousPeriod,
        samePeriodLastYear: samePeriodLastYear,
        samePeriodLastYearAccumulation: samePeriodLastYearAccumulation,
        oneYearAgo: oneYearAgo,
        twoYearAgo: twoYearAgo,
        threeYearAgo: threeYearAgo,
        fourYearAgo: fourYearAgo,
        context: context
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getPublicTarget报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });