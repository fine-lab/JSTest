let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, resAllSubjectInfo, OneCodeCredit) {
    try {
      // 平均资本=[（年初实收资本+年初资本公积）+（年末实收资本+年末资本公积）]/2
      // 获取本期收入集合
      var currentPeriodList = resAllSubjectInfo.resObject.currentPeriod;
      var currentPeriod = 0;
      if (currentPeriodList != null) {
        currentPeriodList.forEach((item) => {
          if (
            OneCodeCredit.includes(item.accsubject_code) &&
            item.hasOwnProperty("localcredebit1") &&
            item.localcredebit1 != null &&
            item.hasOwnProperty("localcredebit3") &&
            item.localcredebit3 != null
          ) {
            currentPeriod = currentPeriod + item.localcredebit1 + item.localcredebit3;
          }
        });
      }
      currentPeriod = currentPeriod / 2;
      // 年累计值
      var annualAccumulationList = resAllSubjectInfo.resObject.annualAccumulation;
      var annualAccumulation = 0;
      if (annualAccumulationList != null) {
        annualAccumulationList.forEach((item) => {
          if (
            OneCodeCredit.includes(item.accsubject_code) &&
            item.hasOwnProperty("localcredebit1") &&
            item.localcredebit1 != null &&
            item.hasOwnProperty("localcredebit3") &&
            item.localcredebit3 != null
          ) {
            annualAccumulation = annualAccumulation + item.localcredebit1 + item.localcredebit3;
          }
        });
      }
      annualAccumulation = annualAccumulation / 2;
      // 上期值
      var previousPeriodList = resAllSubjectInfo.resObject.previousPeriod;
      var previousPeriod = 0;
      if (previousPeriodList != null) {
        previousPeriodList.forEach((item) => {
          if (
            OneCodeCredit.includes(item.accsubject_code) &&
            item.hasOwnProperty("localcredebit1") &&
            item.localcredebit1 != null &&
            item.hasOwnProperty("localcredebit3") &&
            item.localcredebit3 != null
          ) {
            previousPeriod = previousPeriod + item.localcredebit1 + item.localcredebit3;
          }
        });
      }
      previousPeriod = previousPeriod / 2;
      // 上年同期值
      var samePeriodLastYearList = resAllSubjectInfo.resObject.samePeriodLastYear;
      var samePeriodLastYear = 0;
      if (samePeriodLastYearList != null) {
        samePeriodLastYearList.forEach((item) => {
          if (
            OneCodeCredit.includes(item.accsubject_code) &&
            item.hasOwnProperty("localcredebit1") &&
            item.localcredebit1 != null &&
            item.hasOwnProperty("localcredebit3") &&
            item.localcredebit3 != null
          ) {
            samePeriodLastYear = samePeriodLastYear + item.localcredebit1 + item.localcredebit3;
          }
        });
      }
      samePeriodLastYear = samePeriodLastYear / 2;
      // 上年同期年累计值
      var samePeriodLastYearAccumulationList = resAllSubjectInfo.resObject.samePeriodLastYearAccumulation;
      var samePeriodLastYearAccumulation = 0;
      if (samePeriodLastYearAccumulationList != null) {
        samePeriodLastYearAccumulationList.forEach((item) => {
          if (
            OneCodeCredit.includes(item.accsubject_code) &&
            item.hasOwnProperty("localcredebit1") &&
            item.localcredebit1 != null &&
            item.hasOwnProperty("localcredebit3") &&
            item.localcredebit3 != null
          ) {
            samePeriodLastYearAccumulation = samePeriodLastYearAccumulation + item.localcredebit1 + item.localcredebit3;
          }
        });
      }
      samePeriodLastYearAccumulation = samePeriodLastYearAccumulation / 2;
      // 获取一年前值
      var oneYearAgoList = resAllSubjectInfo.resObject.oneYearAgo;
      var oneYearAgo = 0;
      if (oneYearAgoList != null) {
        oneYearAgoList.forEach((item) => {
          if (
            OneCodeCredit.includes(item.accsubject_code) &&
            item.hasOwnProperty("localcredebit1") &&
            item.localcredebit1 != null &&
            item.hasOwnProperty("localcredebit3") &&
            item.localcredebit3 != null
          ) {
            oneYearAgo = oneYearAgo + item.localcredebit1 + item.localcredebit3;
          }
        });
      }
      oneYearAgo = oneYearAgo / 2;
      // 获取两年前值
      var twoYearAgoList = resAllSubjectInfo.resObject.twoYearAgo;
      var twoYearAgo = 0;
      if (twoYearAgoList != null) {
        twoYearAgoList.forEach((item) => {
          if (
            OneCodeCredit.includes(item.accsubject_code) &&
            item.hasOwnProperty("localcredebit1") &&
            item.localcredebit1 != null &&
            item.hasOwnProperty("localcredebit3") &&
            item.localcredebit3 != null
          ) {
            twoYearAgo = twoYearAgo + item.localcredebit1 + item.localcredebit3;
          }
        });
      }
      twoYearAgo = twoYearAgo / 2;
      // 获取三年前值
      var threeYearAgoList = resAllSubjectInfo.resObject.threeYearAgo;
      var threeYearAgo = 0;
      if (threeYearAgoList != null) {
        threeYearAgoList.forEach((item) => {
          if (
            OneCodeCredit.includes(item.accsubject_code) &&
            item.hasOwnProperty("localcredebit1") &&
            item.localcredebit1 != null &&
            item.hasOwnProperty("localcredebit3") &&
            item.localcredebit3 != null
          ) {
            threeYearAgo = threeYearAgo + item.localcredebit1 + item.localcredebit3;
          }
        });
      }
      threeYearAgo = threeYearAgo / 2;
      // 获取四年前值
      var fourYearAgoList = resAllSubjectInfo.resObject.fourYearAgo;
      var fourYearAgo = 0;
      if (fourYearAgoList != null) {
        fourYearAgoList.forEach((item) => {
          if (
            OneCodeCredit.includes(item.accsubject_code) &&
            item.hasOwnProperty("localcredebit1") &&
            item.localcredebit1 != null &&
            item.hasOwnProperty("localcredebit3") &&
            item.localcredebit3 != null
          ) {
            fourYearAgo = fourYearAgo + item.localcredebit1 + item.localcredebit3;
          }
        });
      }
      fourYearAgo = fourYearAgo / 2;
      // 保留两位小数  MoneyFormatReturnBd(value,pointnumber);
      let pointnumber = 2;
      // 环比增长率
      var monthOnMonthGrowthRate = 0;
      if (previousPeriod == 0) {
        monthOnMonthGrowthRate = null;
      } else {
        monthOnMonthGrowthRate = (currentPeriod - previousPeriod) / previousPeriod;
      }
      // 环比增长值
      var monthOnMonthGrowth = currentPeriod - previousPeriod;
      // 同比增长率
      var yearToYearGrowthRate = 0;
      if (samePeriodLastYear == 0) {
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
      throw new Error("执行脚本getCapital报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });