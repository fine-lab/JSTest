let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, resAllSubjectInfo, OneCodeCredit, OneCodeDebit, twoCodeCredit, twoCodeDebit) {
    try {
      // 获取收入6001  OneCodeCredit贷方收入  OneCodeDebit借方收入
      // 获取成本    twoCodeCredit贷方成本  twoCodeDebit借方成本
      // 用科目的贷方+借方   然后减去例如成本类的科目的贷方和借方
      // 获取本期收入集合
      var currentPeriodList = resAllSubjectInfo.resObject.currentPeriod;
      var currentPeriod = 0;
      if (currentPeriodList != null) {
        currentPeriodList.forEach((item) => {
          if (OneCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            currentPeriod = currentPeriod + item.localcredebit2;
          }
          if (OneCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            currentPeriod = currentPeriod + item.localdebit2;
          }
          if (twoCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            currentPeriod = currentPeriod - item.localcredebit2;
          }
          if (twoCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            currentPeriod = currentPeriod - item.localdebit2;
          }
        });
      }
      // 年累计值
      var annualAccumulationList = resAllSubjectInfo.resObject.annualAccumulation;
      var annualAccumulation = 0;
      if (annualAccumulationList != null) {
        annualAccumulationList.forEach((item) => {
          if (OneCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            annualAccumulation = annualAccumulation + item.localcredebit2;
          }
          if (OneCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            annualAccumulation = annualAccumulation + item.localdebit2;
          }
          if (twoCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            annualAccumulation = annualAccumulation - item.localcredebit2;
          }
          if (twoCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            annualAccumulation = annualAccumulation - item.localdebit2;
          }
        });
      }
      // 上期值
      var previousPeriodList = resAllSubjectInfo.resObject.previousPeriod;
      var previousPeriod = 0;
      if (previousPeriodList != null) {
        previousPeriodList.forEach((item) => {
          if (OneCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            previousPeriod = previousPeriod + item.localcredebit2;
          }
          if (OneCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            previousPeriod = previousPeriod + item.localdebit2;
          }
          if (twoCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            previousPeriod = previousPeriod - item.localcredebit2;
          }
          if (twoCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            previousPeriod = previousPeriod - item.localdebit2;
          }
        });
      }
      // 上年同期值
      var samePeriodLastYearList = resAllSubjectInfo.resObject.samePeriodLastYear;
      var samePeriodLastYear = 0;
      if (samePeriodLastYearList != null) {
        samePeriodLastYearList.forEach((item) => {
          if (OneCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            samePeriodLastYear = samePeriodLastYear + item.localcredebit2;
          }
          if (OneCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            samePeriodLastYear = samePeriodLastYear + item.localdebit2;
          }
          if (twoCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            samePeriodLastYear = samePeriodLastYear - item.localcredebit2;
          }
          if (twoCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            samePeriodLastYear = samePeriodLastYear - item.localdebit2;
          }
        });
      }
      // 上年同期年累计值
      var samePeriodLastYearAccumulationList = resAllSubjectInfo.resObject.samePeriodLastYearAccumulation;
      var samePeriodLastYearAccumulation = 0;
      if (samePeriodLastYearAccumulationList != null) {
        samePeriodLastYearAccumulationList.forEach((item) => {
          if (OneCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            samePeriodLastYearAccumulation = samePeriodLastYearAccumulation + item.localcredebit2;
          }
          if (OneCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            samePeriodLastYearAccumulation = samePeriodLastYearAccumulation + item.localdebit2;
          }
          if (twoCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            samePeriodLastYearAccumulation = samePeriodLastYearAccumulation - item.localcredebit2;
          }
          if (twoCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            samePeriodLastYearAccumulation = samePeriodLastYearAccumulation - item.localdebit2;
          }
        });
      }
      // 获取一年前值
      var oneYearAgoList = resAllSubjectInfo.resObject.oneYearAgo;
      var oneYearAgo = 0;
      if (oneYearAgoList != null) {
        oneYearAgoList.forEach((item) => {
          if (OneCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            oneYearAgo = oneYearAgo + item.localcredebit2;
          }
          if (OneCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            oneYearAgo = oneYearAgo + item.localdebit2;
          }
          if (twoCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            oneYearAgo = oneYearAgo - item.localcredebit2;
          }
          if (twoCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            oneYearAgo = oneYearAgo - item.localdebit2;
          }
        });
      }
      // 获取两年前值
      var twoYearAgoList = resAllSubjectInfo.resObject.twoYearAgo;
      var twoYearAgo = 0;
      if (twoYearAgoList != null) {
        twoYearAgoList.forEach((item) => {
          if (OneCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            twoYearAgo = twoYearAgo + item.localcredebit2;
          }
          if (OneCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            twoYearAgo = twoYearAgo + item.localdebit2;
          }
          if (twoCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            twoYearAgo = twoYearAgo - item.localcredebit2;
          }
          if (twoCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            twoYearAgo = twoYearAgo - item.localdebit2;
          }
        });
      }
      // 获取三年前值
      var threeYearAgoList = resAllSubjectInfo.resObject.threeYearAgo;
      var threeYearAgo = 0;
      if (threeYearAgoList != null) {
        threeYearAgoList.forEach((item) => {
          if (OneCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            threeYearAgo = threeYearAgo + item.localcredebit2;
          }
          if (OneCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            threeYearAgo = threeYearAgo + item.localdebit2;
          }
          if (twoCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            threeYearAgo = threeYearAgo - item.localcredebit2;
          }
          if (twoCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            threeYearAgo = threeYearAgo - item.localdebit2;
          }
        });
      }
      // 获取四年前值
      var fourYearAgoList = resAllSubjectInfo.resObject.fourYearAgo;
      var fourYearAgo = 0;
      if (fourYearAgoList != null) {
        fourYearAgoList.forEach((item) => {
          if (OneCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            fourYearAgo = fourYearAgo + item.localcredebit2;
          }
          if (OneCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            fourYearAgo = fourYearAgo + item.localdebit2;
          }
          if (twoCodeCredit.includes(item.accsubject_code) && item.hasOwnProperty("localcredebit2") && item.localcredebit2 != null) {
            fourYearAgo = fourYearAgo - item.localcredebit2;
          }
          if (twoCodeDebit.includes(item.accsubject_code) && item.hasOwnProperty("localdebit2") && item.localdebit2 != null) {
            fourYearAgo = fourYearAgo - item.localdebit2;
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
      throw new Error("执行脚本getSubtraction报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });