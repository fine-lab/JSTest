let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, resProfit, resTax) {
    try {
      // 保留两位小数  MoneyFormatReturnBd(value,pointnumber);
      let pointnumber = 2;
      // 获取本期
      var currentPeriod = null;
      if (resProfit.resObject.currentPeriod != null && resTax.resObject.currentPeriod != null && resTax.resObject.currentPeriod != 0) {
        currentPeriod = resProfit.resObject.currentPeriod / resTax.resObject.currentPeriod;
      }
      // 年累计值
      var annualAccumulation = null;
      if (resProfit.resObject.annualAccumulation != null && resTax.resObject.annualAccumulation != null && resTax.resObject.annualAccumulation != 0) {
        annualAccumulation = resProfit.resObject.annualAccumulation / resTax.resObject.annualAccumulation;
      }
      // 上期值
      var previousPeriod = null;
      if (resProfit.resObject.previousPeriod != null && resTax.resObject.previousPeriod != null && resTax.resObject.previousPeriod != 0) {
        previousPeriod = resProfit.resObject.previousPeriod / resTax.resObject.previousPeriod;
      }
      // 上年同期值
      var samePeriodLastYear = null;
      if (resProfit.resObject.samePeriodLastYear != null && resTax.resObject.samePeriodLastYear != null && resTax.resObject.samePeriodLastYear != 0) {
        samePeriodLastYear = resProfit.resObject.samePeriodLastYear / resTax.resObject.samePeriodLastYear;
      }
      // 上年同期累计值
      var samePeriodLastYearAccumulation = null;
      if (resProfit.resObject.samePeriodLastYearAccumulation != null && resTax.resObject.samePeriodLastYearAccumulation != null && resTax.resObject.samePeriodLastYearAccumulation != 0) {
        samePeriodLastYear = resProfit.resObject.samePeriodLastYearAccumulation / resTax.resObject.samePeriodLastYearAccumulation;
      }
      // 获取一年前值
      var oneYearAgo = null;
      if (resProfit.resObject.oneYearAgo != null && resTax.resObject.oneYearAgo != null && resTax.resObject.oneYearAgo != 0) {
        oneYearAgo = resProfit.resObject.oneYearAgo / resTax.resObject.oneYearAgo;
      }
      // 获取两年前值
      var twoYearAgo = null;
      if (resProfit.resObject.twoYearAgo != null && resTax.resObject.twoYearAgo != null && resTax.resObject.twoYearAgo != 0) {
        twoYearAgo = resProfit.resObject.twoYearAgo / resTax.resObject.twoYearAgo;
      }
      // 获取三年前值
      var threeYearAgo = null;
      if (resProfit.resObject.threeYearAgo != null && resTax.resObject.threeYearAgo != null && resTax.resObject.threeYearAgo != 0) {
        threeYearAgo = resProfit.resObject.threeYearAgo / resTax.resObject.threeYearAgo;
      }
      // 获取四年前值
      var fourYearAgo = null;
      if (resProfit.resObject.fourYearAgo != null && resTax.resObject.fourYearAgo != null && resTax.resObject.fourYearAgo != 0) {
        fourYearAgo = resProfit.resObject.fourYearAgo / resTax.resObject.fourYearAgo;
      }
      // 环比增长率
      var monthOnMonthGrowthRate = 0;
      if (previousPeriod == 0 || previousPeriod == null) {
        monthOnMonthGrowthRate = null;
      } else {
        monthOnMonthGrowthRate = (currentPeriod - previousPeriod) / previousPeriod;
      }
      // 环比增长值
      var monthOnMonthGrowth = currentPeriod - previousPeriod;
      // 同比增长率
      var yearToYearGrowthRate = 0;
      if (samePeriodLastYear == 0 || samePeriodLastYear == null) {
        yearToYearGrowthRate = null;
      } else {
        yearToYearGrowthRate = (currentPeriod - samePeriodLastYear) / samePeriodLastYear;
      }
      // 同比年累计增长率
      var yearToYearGrowthAccumulationRate = 0;
      if (samePeriodLastYearAccumulation == 0) {
        yearToYearGrowthAccumulationRate = null;
      } else {
        yearToYearGrowthAccumulationRate = (annualAccumulation - samePeriodLastYearAccumulation) / samePeriodLastYearAccumulation;
      }
      // 一年前同比增长率
      var oneYearAgoYearToYearGrowthRate = 0;
      if (twoYearAgo == 0 || twoYearAgo == null) {
        oneYearAgoYearToYearGrowthRate = null;
      } else {
        oneYearAgoYearToYearGrowthRate = (oneYearAgo - twoYearAgo) / twoYearAgo;
      }
      // 两年前同比增长率
      var twoYearAgoYearToYearGrowthRate = 0;
      if (threeYearAgo == 0 || threeYearAgo == null) {
        twoYearAgoYearToYearGrowthRate = null;
      } else {
        twoYearAgoYearToYearGrowthRate = (twoYearAgo - threeYearAgo) / threeYearAgo;
      }
      // 三年前同比增长率
      var threeYearAgoYearToYearGrowthRate = 0;
      if (fourYearAgo == 0 || fourYearAgo == null) {
        threeYearAgoYearToYearGrowthRate = null;
      } else {
        threeYearAgoYearToYearGrowthRate = (threeYearAgo - fourYearAgo) / fourYearAgo;
      }
      // 返回当前指标所有同比环比等相关信息
      var resObject = {
        currentPeriod: MoneyFormatReturnBd(currentPeriod, pointnumber),
        annualAccumulation: MoneyFormatReturnBd(annualAccumulation, pointnumber),
        previousPeriod: MoneyFormatReturnBd(previousPeriod, pointnumber),
        samePeriodLastYear: MoneyFormatReturnBd(samePeriodLastYear, pointnumber),
        oneYearAgo: MoneyFormatReturnBd(oneYearAgo, pointnumber),
        twoYearAgo: MoneyFormatReturnBd(twoYearAgo, pointnumber),
        threeYearAgo: MoneyFormatReturnBd(threeYearAgo, pointnumber),
        monthOnMonthGrowth: monthOnMonthGrowth,
        yearToYearGrowthAccumulationRate: MoneyFormatReturnBd(yearToYearGrowthAccumulationRate, pointnumber),
        monthOnMonthGrowthRate: MoneyFormatReturnBd(monthOnMonthGrowthRate, pointnumber),
        yearToYearGrowthRate: MoneyFormatReturnBd(yearToYearGrowthRate, pointnumber),
        oneYearAgoYearToYearGrowthRate: MoneyFormatReturnBd(oneYearAgoYearToYearGrowthRate, pointnumber),
        twoYearAgoYearToYearGrowthRate: MoneyFormatReturnBd(twoYearAgoYearToYearGrowthRate, pointnumber),
        threeYearAgoYearToYearGrowthRate: MoneyFormatReturnBd(threeYearAgoYearToYearGrowthRate, pointnumber),
        context: context
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getProfitRate报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });