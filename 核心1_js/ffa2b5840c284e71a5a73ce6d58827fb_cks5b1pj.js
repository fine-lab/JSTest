let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
      var currentPeriodList = currentPeriod;
      var annualAccumulationList = annualAccumulation;
      var previousPeriodList = previousPeriod;
      var samePeriodLastYearList = samePeriodLastYear;
      // 本期
      var startCurrentPeriod = 0;
      if (currentPeriodList != null) {
        currentPeriodList.forEach((item) => {
          startCurrentPeriod = startCurrentPeriod + item.localcredebit1;
        });
      }
      // 年累计值
      var startAnnualAccumulation = 0;
      if (annualAccumulationList != null) {
        annualAccumulationList.forEach((item) => {
          startAnnualAccumulation = startAnnualAccumulation + item.localcredebit1;
        });
      }
      // 上期值
      var startPreviousPeriod = 0;
      if (previousPeriodList != null) {
        previousPeriodList.forEach((item) => {
          startPreviousPeriod = startPreviousPeriod + item.localcredebit1;
        });
      }
      // 上年同期值
      var startSamePeriodLastYear = 0;
      if (samePeriodLastYearList != null) {
        samePeriodLastYearList.forEach((item) => {
          startSamePeriodLastYear = startSamePeriodLastYear + item.localcredebit2;
        });
      }
      // 本期
      var endCurrentPeriod = 0;
      if (currentPeriodList != null) {
        currentPeriodList.forEach((item) => {
          endCurrentPeriod = endCurrentPeriod + item.localcredebit3;
        });
      }
      // 年累计值
      var endAnnualAccumulation = 0;
      if (annualAccumulationList != null) {
        annualAccumulationList.forEach((item) => {
          endAnnualAccumulation = endAnnualAccumulation + item.localcredebit3;
        });
      }
      // 上期值
      var endPreviousPeriod = 0;
      if (previousPeriodList != null) {
        previousPeriodList.forEach((item) => {
          endPreviousPeriod = endPreviousPeriod + item.localcredebit3;
        });
      }
      // 上年同期值
      var endSamePeriodLastYear = 0;
      if (samePeriodLastYearList != null) {
        samePeriodLastYearList.forEach((item) => {
          endSamePeriodLastYear = endSamePeriodLastYear + item.localcredebit3;
        });
      }
      // 返回当前指标所有同比环比等相关信息
      var resObject = {
        startCurrentPeriod: startCurrentPeriod,
        startAnnualAccumulation: startAnnualAccumulation,
        startPreviousPeriod: startPreviousPeriod,
        startSamePeriodLastYear: startSamePeriodLastYear,
        endCurrentPeriod: endCurrentPeriod,
        endAnnualAccumulation: endAnnualAccumulation,
        endPreviousPeriod: endPreviousPeriod,
        endSamePeriodLastYear: endSamePeriodLastYear,
        context: context
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getOwnereQuity报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });