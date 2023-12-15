let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, resProfit, resTax) {
    try {
      // 获取主营业务收入6001  获取其他业务收入6051
      // 通过控制不同的科目编码对各项指标进行计算，贷方减去借方
      // 获取税 税=应交所得税222131贷+递延所得税负债2901贷-递延所得税资产1811借
      // 获取本期收入集合
      var currentPeriod = resProfit.resObject.currentPeriod - resTax.resObject.currentPeriod;
      // 年累计值
      var annualAccumulation = resProfit.resObject.annualAccumulation - resTax.resObject.annualAccumulation;
      // 上期值
      var previousPeriod = resProfit.resObject.previousPeriod - resTax.resObject.previousPeriod;
      // 上年同期值
      var samePeriodLastYear = resProfit.resObject.samePeriodLastYear - resTax.resObject.samePeriodLastYear;
      // 获取一年前值
      var oneYearAgo = resProfit.resObject.oneYearAgo - resTax.resObject.oneYearAgo;
      // 获取两年前值
      var twoYearAgo = resProfit.resObject.twoYearAgo - resTax.resObject.twoYearAgo;
      // 获取三年前值
      var threeYearAgo = resProfit.resObject.threeYearAgo - resTax.resObject.threeYearAgo;
      // 获取四年前值
      var fourYearAgo = resProfit.resObject.fourYearAgo - resTax.resObject.fourYearAgo;
      // 保留两位小数  MoneyFormatReturnBd(value,pointnumber);
      let pointnumber = 2;
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
        monthOnMonthGrowthRate: MoneyFormatReturnBd(monthOnMonthGrowthRate, pointnumber),
        yearToYearGrowthRate: MoneyFormatReturnBd(yearToYearGrowthRate, pointnumber),
        oneYearAgoYearToYearGrowthRate: MoneyFormatReturnBd(oneYearAgoYearToYearGrowthRate, pointnumber),
        twoYearAgoYearToYearGrowthRate: MoneyFormatReturnBd(twoYearAgoYearToYearGrowthRate, pointnumber),
        threeYearAgoYearToYearGrowthRate: MoneyFormatReturnBd(threeYearAgoYearToYearGrowthRate, pointnumber),
        context: context
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getNetProfit报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });