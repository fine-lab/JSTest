let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      var time1 = new Date();
      // 拆分优化后端查询脚本
      // 记录入参的开始和结束期间
      var startPeriod = context.period1;
      var endPeriod = context.period2;
      // 获取收入类中所有的科目类别，编码，借贷方向等信息，供后续使用
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(context, "收入类");
      // 获取成本类中所有的科目类别，编码，借贷方向等信息，供后续使用
      let funcSubjectTypeCost = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectTypeCost = funcSubjectTypeCost.execute(context, "成本费用类");
      let subjectCost = resSubjectTypeCost.res.subject;
      var costCode = 6401;
      var costDirect = "debit";
      subjectCost.forEach((itemCost) => {
        if (itemCost.name == "主营业务成本") {
          costCode = itemCost.code;
          costDirect = itemCost.direct;
        }
      });
      // 定义一个json对象用于存放所有类别下的科目以及其借贷方向
      var allType = resSubjectType.res.allType;
      // 定义一个codes的list  用于存放科目编码所有
      var codes = resSubjectType.res.codes;
      // 定义一个list  存放科目名称、编码、借贷方向  用于相关信息的使用
      var subject = resSubjectType.res.subject;
      // 获取收入 一般来说为主营业务+其他业务收入
      context.codes = codes.concat([costCode]);
      let funcIncome = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resIncome = funcIncome.execute(context);
      // 获取收入的所有指标信息
      let func = extrequire("AT17AF88F609C00004.operatingincome.getIncomeAll");
      let res = func.execute(context, resIncome, codes);
      // 获取主营业务成本的所有指标信息
      let funcCost = extrequire("AT17AF88F609C00004.operatingprofit.getProfitAll");
      let resCost = funcCost.execute(context, resIncome, [costCode], costDirect);
      // 获取主营业务收入的本期，上期，同比，供后续管理建议使用
      let mainCost = resCost.resObject.currentPeriod;
      let lastMainCost = resCost.resObject.previousPeriod;
      let mainCostRate = resCost.resObject.monthOnMonthGrowthRate;
      var time2 = new Date();
      // 重置筛选期间
      context.period1 = startPeriod;
      context.period2 = endPeriod;
      // 获取销售订单数据
      let funcSale = extrequire("AT17AF88F609C00004.sale.getBackForSales");
      let resSale = funcSale.execute(context);
      var time3 = new Date();
      // 重置筛选期间
      context.period1 = startPeriod;
      context.period2 = endPeriod;
      // 获取销售退货数据
      let funcReturn = extrequire("AT17AF88F609C00004.sale.getBackForReturn");
      let resReturn = funcReturn.execute(context);
      // 获取所有科目及其子科目的信息
      context.codes = codes;
      let funcSub = extrequire("AT17AF88F609C00004.common.getSubjectsAll");
      let ressub = funcSub.execute(context);
      var time4 = new Date();
      let industryLevel1 = context.industryLevel1;
      let industryLevel2 = context.industryLevel2;
      let industryLevel3 = context.industryLevel3;
      let industryLevel4 = context.industryLevel4;
      let enterpriseSize = context.enterpriseSize;
      var sqlIndustry =
        "select project,excellent,average,poor from 	AT17AF88F609C00004.AT17AF88F609C00004.enterprisePerformance " +
        "where industryLevel1 = '" +
        industryLevel1 +
        "' and " +
        " industryLevel2 = '" +
        industryLevel2 +
        "' and " +
        " industryLevel3 = '" +
        industryLevel3 +
        "' and " +
        " industryLevel4 = '" +
        industryLevel4 +
        "' and " +
        " enterpriseSize = '" +
        enterpriseSize +
        "' and " +
        "project in ('销售（营业）增长率（%）')";
      var sqlIndustryResult = ObjectStore.queryByYonQL(sqlIndustry);
      let excellent = "";
      let average = "";
      let poor = "";
      sqlIndustryResult.forEach((item1) => {
        if (item1.project == "销售（营业）增长率（%）") {
          excellent = GetBigDecimal(item1.excellent);
          average = GetBigDecimal(item1.average);
          poor = GetBigDecimal(item1.poor);
        }
      });
      // 获取主营业务收入的本期，上期，同比，供后续管理建议使用
      let mainIncome = 0;
      let lastMainIncome = 0;
      let mainIncomeRate = 0;
      // 获取其他业务收入的本期，上期，同比，供后续管理建议使用
      let otherIncome = 0;
      let lastOtherIncome = 0;
      let otherIncomeRate = 0;
      // 计算相关信息
      var relatedInfoListReturn = [];
      subject.forEach((item) => {
        // 获取所有科目并计算相关信息
        let funcSubject = extrequire("AT17AF88F609C00004.operatingprofit.getProfitAll");
        let resSubject = funcSubject.execute(context, resIncome, [item.code], item.direct);
        let advice = "-";
        if (item.name == "主营业务收入") {
          mainIncome = resSubject.resObject.currentPeriod;
          lastMainIncome = resSubject.resObject.previousPeriod;
          mainIncomeRate = resSubject.resObject.monthOnMonthGrowthRate;
          advice =
            "较上期变化" +
            MoneyFormatReturnBd(resSubject.resObject.monthOnMonthGrowthRate * 100, 2) +
            "%，销售数量" +
            resSale.resObject.monthOnMonthGrowthRateQty * 100 +
            "%的变化对主营业收入有所影响。\n" +
            "1.增加销售渠道：增加销售渠道可以扩大企业的销售网络，提高销售量。\n" +
            "2.加强市场营销：加强市场营销可以提高企业的知名度和品牌影响力，从而吸引更多的客户。\n" +
            "3.提高价格：提高价格可以提高企业的收益水平。\n" +
            "4.降低成本：降低成本可以提高企业的利润率，从而提高主营业务收入。";
        }
        if (item.name == "其他业务收入") {
          otherIncome = resSubject.resObject.currentPeriod;
          lastOtherIncome = resSubject.resObject.previousPeriod;
          otherIncomeRate = resSubject.resObject.monthOnMonthGrowthRate;
          let proportion = 0;
          let change = 0;
          let subName;
          if (ressub[item.code].hasOwnProperty("detailCode") && item.direct == "credit") {
            proportion = ressub[item.code].detailwithsubjectCreditRate;
          }
          if (ressub[item.code].hasOwnProperty("detailCode") && item.direct == "debit") {
            proportion = ressub[item.code].detailwithsubjectDebitRate;
          }
          if (item.direct == "credit" && ressub[item.code].detailCreditRate != null) {
            change = ressub[item.code].detailCreditRate;
          }
          if (item.direct == "debit" && ressub[item.code].detailDebitRate != null) {
            change = ressub[item.code].detailDebitRate;
          }
          if (ressub[item.code].hasOwnProperty("detailName")) {
            subName = ressub[item.code].detailName;
          }
          if (subName != null) {
            advice = "其中" + subName + "占" + proportion * 100 + "%，" + subName + "较上期变化" + change * 100 + "%。";
          }
        }
        var sub = {
          zhibiaomingchen: item.name,
          benqizhi: resSubject.resObject.currentPeriod,
          huanbizengchang: resSubject.resObject.monthOnMonthGrowthRate,
          tongbizengchang: resSubject.resObject.yearToYearGrowthRate,
          nianleijizhi: resSubject.resObject.annualAccumulation,
          yewujianyi: advice
        };
        relatedInfoListReturn.push(sub);
      });
      // 计算管理建议
      var managementAdviceList = [];
      let param1 = { name: "收入" };
      let param2 = { key: "yourkeyHere" };
      let managementAdviceHistoryFunc = extrequire("AT17AF88F609C00004.common.getManaHisInfo");
      let managementAdviceHistoryList = managementAdviceHistoryFunc.execute(param1, param2).res;
      // 保留两位小数  MoneyFormatReturnBd(value,pointnumber);
      let pointnumber = 2;
      let strIncome = MoneyFormatReturnBd(res.resObject.currentPeriod / 10000, pointnumber);
      let mainIncomeChange = MoneyFormatReturnBd((mainIncome - lastMainIncome) / 10000, pointnumber);
      let mainStr = "环比增加" + mainIncomeChange + "万元，增长幅度" + mainIncomeRate + "%";
      if (mainIncomeChange < 0) {
        mainStr = "环比减少" + -mainIncomeChange + "万元，下降幅度" + -mainIncomeRate + "%";
      }
      let otherIncomeChange = MoneyFormatReturnBd((otherIncome - lastOtherIncome) / 10000, pointnumber);
      let otherStr = "环比增加" + otherIncomeChange + "万元，增长幅度" + otherIncomeRate + "%";
      if (otherIncomeChange < 0) {
        otherStr = "环比减少" + -otherIncomeChange + "万元，下降幅度" + -otherIncomeRate + "%";
      }
      let mainCostChange = MoneyFormatReturnBd((mainCost - lastMainCost) / 10000, pointnumber);
      let mainCostStr = "环比增加" + mainCostChange + "万元，增长幅度" + mainCostRate + "%";
      if (mainCostChange < 0) {
        mainCostStr = "环比减少" + -mainCostChange + "万元，下降幅度" + -mainCostRate + "%";
      }
      let compareAdvice = "主营业务收入变化幅度大于主营业务成本";
      if ((mainIncomeRate > 0 && mainIncomeRate - mainCostRate < 0) || (mainIncomeRate < 0 && mainIncomeRate - mainCostRate > 0)) {
        compareAdvice = "主营业务收入变化幅度小于主营业务成本";
      }
      let str =
        "期间内公司实现营业收入" +
        strIncome +
        "万元，其中主营业务收入" +
        mainIncome +
        "万元，" +
        mainStr +
        " 。\n" +
        "其他业务收入" +
        otherIncome +
        "万元，" +
        otherStr +
        "。\n" +
        "主营业务成本" +
        mainCost +
        "万元，" +
        mainCostStr +
        "。\n" +
        "从主营业务收入与主营业务成本的增长情况来看，" +
        compareAdvice +
        "。\n" +
        "\n" +
        "提高企业的营业收入需要从多个方面进行策略性的管理和执行，以下是一些提高营业收入的建议供参考：\n" +
        "1.	提高产品价格：企业可以通过逐步提高产品的价格来增加营业收入，需要注意的是，价格变动可能会影响市场需求，需谨慎考虑价格变动的影响。\n" +
        "        也可以通过增加产品的附加值来提高产品售价，例如提供更好的售后服务等\n" +
        "2.	扩大销售渠道：企业可以通过扩大销售渠道来增加销售量。例如开设新的销售渠道，如线上销售等，以及扩大销售网络，覆盖更多的地区\n" +
        "3.	增加促销活动：例如：打折、赠品、或限时优惠等。";
      var managementAdvice = { guanlijianyi1: str };
      managementAdviceList.push(managementAdvice);
      var time5 = new Date();
      var businessStatus =
        "期间内公司实现营业收入" +
        strIncome +
        "万元，其中主营业务收入" +
        mainIncome +
        "万元，" +
        mainStr +
        " 。\n" +
        "其他业务收入" +
        otherIncome +
        "万元，" +
        otherStr +
        "。\n" +
        "主营业务成本" +
        mainCost +
        "万元，" +
        mainCostStr +
        "。\n";
      // 在扩展信息中插入AI智能建议模板
      var param = businessStatus;
      var object = [
        {
          name: "收入",
          baseInfoList: [
            {
              zhibiaomingchen: "营业收入",
              benqizhi: res.resObject.currentPeriod,
              huanbizengchang: res.resObject.monthOnMonthGrowthRate,
              tongbizengchang: res.resObject.yearToYearGrowthRate,
              nianleijizhi: res.resObject.annualAccumulation
            }
          ],
          historyInfoList: [
            {
              zhibiaomingchen: "营业收入",
              yinianqian: res.resObject.oneYearAgo,
              liangnianqian: res.resObject.twoYearAgo,
              sannianqian: res.resObject.threeYearAgo
            },
            {
              zhibiaomingchen: "同比",
              yinianqian: res.resObject.oneYearAgoYearToYearGrowthRate,
              liangnianqian: res.resObject.twoYearAgoYearToYearGrowthRate,
              sannianqian: res.resObject.threeYearAgoYearToYearGrowthRate
            }
          ],
          detailsInfoList: relatedInfoListReturn,
          extendedInfoList: [
            {
              zhibiaomingchen: "销售收入",
              benqizhi: resSale.resObject.currentPeriod,
              huanbizengchang: resSale.resObject.monthOnMonthGrowthRate,
              tongbizengchang: resSale.resObject.yearToYearGrowthRate,
              nianleijizhi: resSale.resObject.annualAccumulation,
              yewujianyi: "销售收入较上期变化" + resSale.resObject.monthOnMonthGrowthRate * 100 + "%，其中销售价格较上期有波动。",
              param: param
            },
            {
              zhibiaomingchen: "销售数量",
              benqizhi: resSale.resObject.currentPeriodQty,
              huanbizengchang: resSale.resObject.monthOnMonthGrowthRateQty,
              tongbizengchang: resSale.resObject.yearToYearGrowthRateQty,
              nianleijizhi: resSale.resObject.annualAccumulationQty,
              yewujianyi: "销售数量较上期变化" + resSale.resObject.monthOnMonthGrowthRateQty * 100 + "%，其中销售退货数量较上期变化" + resReturn.resObject.monthOnMonthGrowthRateQty * 100 + "%。"
            },
            {
              zhibiaomingchen: "营业收入增长率",
              benqizhi: res.resObject.oneYearAgoYearToYearGrowthRate,
              huanbizengchang: "",
              tongbizengchang: "",
              excellent: excellent,
              average: average,
              pool: poor,
              nianleijizhi: res.resObject.yearToYearGrowthAccumulationRate,
              yewujianyi: "-"
            }
          ],
          managementAdviceList: managementAdviceList,
          managementAdviceHistoryList: managementAdviceHistoryList
        }
      ];
      var time = { time1, time2, time3, time4, time5 };
      var res1 = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", object, "yb3cfbba9b");
      return { time };
    } catch (e) {
      throw new Error("执行脚本getBackForIncome报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });