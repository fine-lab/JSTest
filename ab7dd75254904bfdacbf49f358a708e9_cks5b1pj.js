let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      var org = context.org;
      var vouchdate = context.period2;
      var sql = "select vouchdate,t1.oriSum,t1.qty from voucher.salereturn.SaleReturn left join voucher.salereturn.SaleReturnDetail t1  on id=t1.saleReturnId where salesOrgId ='";
      // 获取本期销售价格  数量
      var sql1 = sql + org + "' and vouchdate leftlike '" + vouchdate + "'";
      var res1 = ObjectStore.queryByYonQL(sql1, "udinghuo");
      var currentPeriod = 0;
      var currentPeriodQty = 0;
      res1.forEach((item) => {
        currentPeriod = currentPeriod + item.t1_oriSum;
        currentPeriodQty = currentPeriodQty + item.t1_qty;
      });
      // 获取上期销售价格  数量
      let funcPreviousPeriodDate = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      var vouchdatePrevious = funcPreviousPeriodDate.execute(vouchdate).date;
      var sql2 = sql + org + "' and vouchdate leftlike '" + vouchdatePrevious + "'";
      var res2 = ObjectStore.queryByYonQL(sql2, "udinghuo");
      var previousPeriod = 0;
      var previousPeriodQty = 0;
      res2.forEach((item) => {
        previousPeriod = previousPeriod + item.t1_oriSum;
        previousPeriodQty = previousPeriodQty + item.t1_qty;
      });
      // 获取上年同期销售价格  数量
      let funcSamePeriodLastYearDate = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      var vouchdateSamePrevious = funcSamePeriodLastYearDate.execute(vouchdate).date;
      var sql3 = sql + org + "' and vouchdate leftlike '" + vouchdateSamePrevious + "'";
      var res3 = ObjectStore.queryByYonQL(sql3, "udinghuo");
      var samePeriodLastYear = 0;
      var samePeriodLastYearQty = 0;
      res3.forEach((item) => {
        samePeriodLastYear = samePeriodLastYear + item.t1_oriSum;
        samePeriodLastYearQty = samePeriodLastYearQty + item.t1_qty;
      });
      // 获取本年累计销售价格  数量
      var vouchdateAnnualAccumulation = new Date().getFullYear(vouchdate);
      var sql4 = sql + org + "' and vouchdate leftlike '" + vouchdateAnnualAccumulation + "'";
      var res4 = ObjectStore.queryByYonQL(sql4, "udinghuo");
      var annualAccumulation = 0;
      var annualAccumulationQty = 0;
      res4.forEach((item) => {
        annualAccumulation = annualAccumulation + item.t1_oriSum;
        annualAccumulationQty = annualAccumulationQty + item.t1_qty;
      });
      // 保留两位小数  MoneyFormatReturnBd(value,pointnumber);
      let pointnumber = 2;
      // 销售金额环比增长率
      var monthOnMonthGrowthRate = 0;
      if (previousPeriod == 0) {
        monthOnMonthGrowthRate = null;
      } else {
        monthOnMonthGrowthRate = (currentPeriod - previousPeriod) / previousPeriod;
      }
      // 销售金额同比增长率
      var yearToYearGrowthRate = 0;
      if (samePeriodLastYear == 0) {
        yearToYearGrowthRate = null;
      } else {
        yearToYearGrowthRate = (currentPeriod - samePeriodLastYear) / samePeriodLastYear;
      }
      // 销售数量环比增长率
      var monthOnMonthGrowthRateQty = 0;
      if (previousPeriodQty == 0) {
        monthOnMonthGrowthRateQty = null;
      } else {
        monthOnMonthGrowthRateQty = (currentPeriodQty - previousPeriodQty) / previousPeriodQty;
      }
      // 销售数量同比增长率
      var yearToYearGrowthRateQty = 0;
      if (samePeriodLastYearQty == 0) {
        yearToYearGrowthRateQty = null;
      } else {
        yearToYearGrowthRateQty = (currentPeriodQty - samePeriodLastYearQty) / samePeriodLastYearQty;
      }
      // 返回当前指标所有同比环比等相关信息
      var resObject = {
        currentPeriod: currentPeriod,
        annualAccumulation: annualAccumulation,
        previousPeriod: previousPeriod,
        samePeriodLastYear: samePeriodLastYear,
        monthOnMonthGrowthRate: MoneyFormatReturnBd(monthOnMonthGrowthRate, pointnumber),
        yearToYearGrowthRate: MoneyFormatReturnBd(yearToYearGrowthRate, pointnumber),
        currentPeriodQty: currentPeriodQty,
        annualAccumulationQty: annualAccumulationQty,
        previousPeriodQty: previousPeriodQty,
        samePeriodLastYearQty: samePeriodLastYearQty,
        monthOnMonthGrowthRateQty: MoneyFormatReturnBd(monthOnMonthGrowthRateQty, pointnumber),
        yearToYearGrowthRateQty: MoneyFormatReturnBd(yearToYearGrowthRateQty, pointnumber),
        context: context
      };
      return { resObject };
    } catch (e) {
      throw new Error("执行脚本getBackForReturn报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });