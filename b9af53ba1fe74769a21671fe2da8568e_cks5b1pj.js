let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, resAllSubjectInfo, codes, direct1, operator, direct2) {
    try {
      let calculate = extrequire("AT17AF88F609C00004.common.calculate");
      //本年资产负债信息
      var currentPeriodList = resAllSubjectInfo.resObject.currentPeriod;
      currentPeriodList = Array.from(currentPeriodList);
      var currentPeriod = 0;
      if (currentPeriodList != null) {
        currentPeriodList.forEach((item) => {
          if (codes.includes(item.accsubject_code) && item.hasOwnProperty(direct1)) {
            currentPeriod += calculate.execute(item[direct1], item[direct2], operator).result;
          }
        });
      }
      // 年累计值
      var annualAccumulationList = resAllSubjectInfo.resObject.annualAccumulation;
      annualAccumulationList = Array.from(annualAccumulationList);
      var annualAccumulation = 0;
      if (annualAccumulationList != null) {
        annualAccumulationList.forEach((item) => {
          if (codes.includes(item.accsubject_code) && item.hasOwnProperty(direct1)) {
            annualAccumulation += calculate.execute(item[direct1], item[direct2], operator).result;
          }
        });
      }
      // 上期值
      var previousPeriodList = resAllSubjectInfo.resObject.previousPeriod;
      previousPeriodList = Array.from(previousPeriodList);
      var previousPeriod = 0;
      if (previousPeriodList != null) {
        previousPeriodList.forEach((item) => {
          if (codes.includes(item.accsubject_code) && item.hasOwnProperty(direct1)) {
            previousPeriod += calculate.execute(item[direct1], item[direct2], operator).result;
          }
        });
      }
      // 上年同期值
      var samePeriodLastYearList = resAllSubjectInfo.resObject.samePeriodLastYear;
      samePeriodLastYearList = Array.from(samePeriodLastYearList);
      var samePeriodLastYear = 0;
      if (samePeriodLastYearList != null) {
        samePeriodLastYearList.forEach((item) => {
          if (codes.includes(item.accsubject_code) && item.hasOwnProperty(direct1)) {
            samePeriodLastYear += calculate.execute(item[direct1], item[direct2], operator).result;
          }
        });
      }
      // 获取一年前值
      var oneYearAgoList = resAllSubjectInfo.resObject.oneYearAgo;
      oneYearAgoList = Array.from(oneYearAgoList);
      var oneYearAgo = 0;
      if (oneYearAgoList != null) {
        oneYearAgoList.forEach((item) => {
          if (codes.includes(item.accsubject_code) && item.hasOwnProperty(direct1)) {
            oneYearAgo += calculate.execute(item[direct1], item[direct2], operator).result;
          }
        });
      }
      // 获取两年前值
      var twoYearAgoList = resAllSubjectInfo.resObject.twoYearAgo;
      twoYearAgoList = Array.from(twoYearAgoList);
      var twoYearAgo = 0;
      if (twoYearAgoList != null) {
        twoYearAgoList.forEach((item) => {
          if (codes.includes(item.accsubject_code) && item.hasOwnProperty(direct1)) {
            twoYearAgo += calculate.execute(item[direct1], item[direct2], operator).result;
          }
        });
      }
      // 获取三年前值
      var threeYearAgoList = resAllSubjectInfo.resObject.threeYearAgo;
      threeYearAgoList = Array.from(threeYearAgoList);
      var threeYearAgo = 0;
      if (threeYearAgoList != null) {
        threeYearAgoList.forEach((item) => {
          if (codes.includes(item.accsubject_code) && item.hasOwnProperty(direct1)) {
            threeYearAgo += calculate.execute(item[direct1], item[direct2], operator).result;
          }
        });
      }
      // 获取四年前值
      var fourYearAgoList = resAllSubjectInfo.resObject.fourYearAgo;
      fourYearAgoList = Array.from(fourYearAgoList);
      var fourYearAgo = 0;
      if (fourYearAgoList != null) {
        fourYearAgoList.forEach((item) => {
          if (codes.includes(item.accsubject_code) && item.hasOwnProperty(direct1)) {
            fourYearAgo += calculate.execute(item[direct1], item[direct2], operator).result;
          }
        });
      }
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
      throw new Error("报错脚本getCalculation," + e);
    }
  }
}
exports({ entryPoint: MyTrigger });