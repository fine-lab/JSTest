let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      // 记录入参的开始和结束期间
      var startPeriod = context.period1;
      var endPeriod = context.period2;
      // 获取 主营业务收入6001贷 主营业务成本6401借 营业外收入6301贷 营业外支出6711借 其他业务收入6051贷 其他业务支出6402借
      // 获取 公允价值变动损益6101贷 投资收益6111贷 其他收益6112贷 税金及附加6405借 销售费用6601借 管理费用6602借 财务费用6603借 勘探费用6604借 资产减值损失6701借
      // 获取 税=应交所得税负债222131贷+递延所得税负债2901贷-递延所得税资产1811借
      // 获取 主营业务收入6001贷  营业外收入6301贷  其他业务收入6051贷 公允价值变动损益6101贷 投资收益6111贷 其他收益6112贷 应交所得税222131贷+递延所得税负债2901贷
      // 获取 主营业务成本6401借 营业外支出6711借 其他业务支出6402借 税金及附加6405借 销售费用6601借 管理费用6602借 财务费用6603借 勘探费用6604借 资产减值损失6701借 递延所得税资产1811借
      // 获取利润类中所有的科目类别，编码，借贷方向等信息，供后续使用
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(context, "利润类");
      // 定义一个json对象用于存放所有类别下的科目以及其借贷方向
      var allType = resSubjectType.res.allType;
      // 定义一个codes的list  用于存放科目编码所有
      var codes = resSubjectType.res.codes;
      // 定义一个list  存放科目名称、编码、借贷方向  用于相关信息的使用
      var subject = resSubjectType.res.subject;
      // 判断三级科目是否存在
      if (allType["利润类费用期间费用"].codeCredit == undefined) {
        var wrong = "缺少三级科目类别期间费用";
        return { wrong };
      }
      context.codes = codes;
      let funcProfitAll = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resProfitAll = funcProfitAll.execute(context);
      var functionPub = "AT17AF88F609C00004.operatingprofit.getDirectionPub";
      // 获取营业收入 主营业务收入+其他业务收入贷方
      let funcIncome = extrequire(functionPub);
      let resIncome = funcIncome.execute(context, resProfitAll, allType["利润类营业收入"].codeCredit, allType["利润类营业收入"].codeDebit);
      // 获取营业成本 主营业务成本+其他业务支出借方
      let funcCost = extrequire(functionPub);
      let resCost = funcCost.execute(context, resProfitAll, allType["利润类营业成本"].codeCredit, allType["利润类营业成本"].codeDebit);
      // 获取营业外收入 营业外收入贷方
      let funcNonOperatingIncome = extrequire(functionPub);
      let resNonOperatingIncome = funcNonOperatingIncome.execute(context, resProfitAll, allType["利润类营业外收入"].codeCredit, allType["利润类营业外收入"].codeDebit);
      // 获取营业外支出 营业外支出借方
      let funcNonOperatingCost = extrequire(functionPub);
      let resNonOperatingCost = funcNonOperatingCost.execute(context, resProfitAll, allType["利润类营业外支出"].codeCredit, allType["利润类营业外支出"].codeDebit);
      // 该函数用于计算科目相减，例如收入贷方借方减去成本贷方借方
      var funcSubtract = "AT17AF88F609C00004.operatingprofit.getSubtraction";
      // 营业利润=毛利润+公允价值变动收益(损失为负)+投资收益(损失为负)+其他收益（损失为负）－营业税金及附加－管理费用－销售费用－财务费用－资产减值损失
      let operatingProfitOneCredit = allType["利润类营业收入"].codeCredit.concat(allType["利润类其他收益"].codeCredit);
      let operatingProfitOneDebit = allType["利润类营业收入"].codeDebit.concat(allType["利润类其他收益"].codeDebit);
      let operatingProfitTwoCredit = allType["利润类营业成本"].codeCredit
        .concat(allType["利润类费用期间费用"].codeCredit)
        .concat(allType["利润类费用税金"].codeCredit)
        .concat(allType["利润类费用其他损失"].codeCredit);
      let operatingProfitTwoDebit = allType["利润类营业成本"].codeDebit
        .concat(allType["利润类费用期间费用"].codeDebit)
        .concat(allType["利润类费用税金"].codeDebit)
        .concat(allType["利润类费用其他损失"].codeDebit);
      let funcOperatingProfit = extrequire(funcSubtract);
      let resOperatingProfit = funcOperatingProfit.execute(context, resProfitAll, operatingProfitOneCredit, operatingProfitOneDebit, operatingProfitTwoCredit, operatingProfitTwoDebit);
      // 利润总额=营业利润+营业外收入6301-营业外支出6711
      let totalProfitOneCredit = allType["利润类营业收入"].codeCredit.concat(allType["利润类其他收益"].codeCredit).concat(allType["利润类营业外收入"].codeCredit);
      let totalProfitOneDebit = allType["利润类营业收入"].codeDebit.concat(allType["利润类其他收益"].codeDebit).concat(allType["利润类营业外收入"].codeDebit);
      let totalProfitTwoCredit = allType["利润类营业成本"].codeCredit
        .concat(allType["利润类费用期间费用"].codeCredit)
        .concat(allType["利润类费用税金"].codeCredit)
        .concat(allType["利润类费用其他损失"].codeCredit)
        .concat(allType["利润类营业外支出"].codeCredit);
      let totalProfitTwoDebit = allType["利润类营业成本"].codeDebit
        .concat(allType["利润类费用期间费用"].codeDebit)
        .concat(allType["利润类费用税金"].codeDebit)
        .concat(allType["利润类费用其他损失"].codeDebit)
        .concat(allType["利润类营业外支出"].codeDebit);
      let funcTotalProfit = extrequire(funcSubtract);
      let resTotalProfit = funcTotalProfit.execute(context, resProfitAll, totalProfitOneCredit, totalProfitOneDebit, totalProfitTwoCredit, totalProfitTwoDebit);
      // 净利润 = 利润总额-税    税=应交所得税222131贷+递延所得税负债2901贷-递延所得税资产1811借
      let netProfitOneCredit = allType["利润类营业收入"].codeCredit
        .concat(allType["利润类其他收益"].codeCredit)
        .concat(allType["利润类营业外收入"].codeCredit)
        .concat(allType["利润类税费资产类税费"].codeCredit);
      let netProfitOneDebit = allType["利润类营业收入"].codeDebit
        .concat(allType["利润类其他收益"].codeDebit)
        .concat(allType["利润类营业外收入"].codeDebit)
        .concat(allType["利润类税费资产类税费"].codeDebit);
      let netProfitTwoCredit = allType["利润类营业成本"].codeCredit
        .concat(allType["利润类费用期间费用"].codeCredit)
        .concat(allType["利润类费用税金"].codeCredit)
        .concat(allType["利润类费用其他损失"].codeCredit)
        .concat(allType["利润类营业外支出"].codeCredit)
        .concat(allType["利润类税费负债类税费"].codeCredit);
      let netProfitTwoDebit = allType["利润类营业成本"].codeDebit
        .concat(allType["利润类费用期间费用"].codeDebit)
        .concat(allType["利润类费用税金"].codeDebit)
        .concat(allType["利润类费用其他损失"].codeDebit)
        .concat(allType["利润类营业外支出"].codeDebit)
        .concat(allType["利润类税费负债类税费"].codeDebit);
      let funcNetProfit = extrequire(funcSubtract);
      let resNetProfit = funcNetProfit.execute(context, resProfitAll, netProfitOneCredit, netProfitOneDebit, netProfitTwoCredit, netProfitTwoDebit);
      // 毛利润=营业收入-营业成本
      let grossProfitOneCredit = allType["利润类营业收入"].codeCredit;
      let grossProfitOneDebit = allType["利润类营业收入"].codeDebit;
      let grossProfitTwoCredit = allType["利润类营业成本"].codeCredit;
      let grossProfitTwoDebit = allType["利润类营业成本"].codeDebit;
      let funcGrossProfit = extrequire(funcSubtract);
      let resGrossProfit = funcGrossProfit.execute(context, resProfitAll, grossProfitOneCredit, grossProfitOneDebit, grossProfitTwoCredit, grossProfitTwoDebit);
      // 核心利润=营业收入-营业成本-税金及附加—销售费用-管理费用-研发费用-利息费用
      let coreProfitOneCredit = allType["利润类营业收入"].codeCredit;
      let coreProfitOneDebit = allType["利润类营业收入"].codeDebit;
      let coreProfitTwoCredit = allType["利润类营业成本"].codeCredit
        .concat(allType["利润类费用期间费用"].codeCredit)
        .concat(allType["利润类费用税金"].codeCredit)
        .concat(allType["利润类费用其他"].codeCredit);
      let coreProfitTwoDebit = allType["利润类营业成本"].codeDebit
        .concat(allType["利润类费用期间费用"].codeDebit)
        .concat(allType["利润类费用税金"].codeDebit)
        .concat(allType["利润类费用其他"].codeDebit);
      let funcCoreProfit = extrequire("AT17AF88F609C00004.operatingprofit.getTax");
      let resCoreProfit = funcCoreProfit.execute(context, resProfitAll, coreProfitOneCredit, coreProfitOneDebit, coreProfitTwoCredit, coreProfitTwoDebit);
      // 利息费用
      let funcInterest = extrequire(functionPub);
      let resInterest = funcInterest.execute(context, resProfitAll, allType["利润类费用其他"].codeCredit, allType["利润类费用其他"].codeDebit);
      // 核心利润率  核心利润/营业收入
      let funcCoreProfitRate = extrequire("AT17AF88F609C00004.operatingprofit.getProfitRate");
      let resCoreProfitRate = funcCoreProfitRate.execute(context, resCoreProfit, resIncome);
      // 营业利润率  营业利润/营业收入
      let funcOperatingProfitRate = extrequire("AT17AF88F609C00004.operatingprofit.getProfitRate");
      let resOperatingProfitRate = funcOperatingProfitRate.execute(context, resOperatingProfit, resIncome);
      // 毛利率  毛利润/营业收入
      let funcGrossProfitRate = extrequire("AT17AF88F609C00004.operatingprofit.getProfitRate");
      let resGrossProfitRate = funcGrossProfitRate.execute(context, resGrossProfit, resIncome);
      // 平均资本=[（年初实收资本+年初资本公积）+（年末实收资本+年末资本公积）]/2
      let capitalCredit = allType["利润类资本"].codeCredit;
      let funcAverageCapital = extrequire("AT17AF88F609C00004.operatingprofit.getCapital");
      let resAverageCapital = funcAverageCapital.execute(context, resProfitAll, capitalCredit);
      // 资本收益率 净利润/平均资本
      let funcCapitalProfitRate = extrequire("AT17AF88F609C00004.operatingprofit.getProfitRate");
      let resCapitalProfitRate = funcCapitalProfitRate.execute(context, resNetProfit, resAverageCapital);
      // 重置筛选期间
      context.period1 = startPeriod;
      context.period2 = endPeriod;
      // 获取销售订单数据
      let funcSale = extrequire("AT17AF88F609C00004.sale.getBackForSales");
      let resSale = funcSale.execute(context);
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
      // 计算基本信息
      var baseInfoList = [
        { name: "利润总额", res: resTotalProfit },
        { name: "营业利润", res: resOperatingProfit },
        { name: "净利润", res: resNetProfit },
        { name: "毛利润", res: resGrossProfit }
      ];
      var baseInfoListReturn = [];
      baseInfoList.forEach((item) => {
        var sub = {
          zhibiaomingchen: item.name,
          benqizhi: item.res.resObject.currentPeriod,
          huanbizengchang: item.res.resObject.monthOnMonthGrowthRate,
          tongbizengchang: item.res.resObject.yearToYearGrowthRate,
          nianleijizhi: item.res.resObject.annualAccumulation,
          yewujianyi: ""
        };
        baseInfoListReturn.push(sub);
      });
      // 计算历史信息
      var historyInfoList = [
        { name: "利润总额", res: resTotalProfit },
        { name: "营业利润", res: resOperatingProfit },
        { name: "净利润", res: resNetProfit },
        { name: "毛利润", res: resGrossProfit }
      ];
      var historyInfoListReturn = [];
      historyInfoList.forEach((item) => {
        var sub = {
          zhibiaomingchen: item.name,
          yinianqian: item.res.resObject.oneYearAgo,
          liangnianqian: item.res.resObject.twoYearAgo,
          sannianqian: item.res.resObject.threeYearAgo
        };
        historyInfoListReturn.push(sub);
        var tongbi = {
          zhibiaomingchen: "同比",
          yinianqian: item.res.resObject.oneYearAgoYearToYearGrowthRate,
          liangnianqian: item.res.resObject.twoYearAgoYearToYearGrowthRate,
          sannianqian: item.res.resObject.threeYearAgoYearToYearGrowthRate
        };
        historyInfoListReturn.push(tongbi);
      });
      let mainIncome;
      let mainCost;
      let taxs;
      // 保留两位小数  MoneyFormatReturnBd(value,pointnumber);
      let pointnumber = 2;
      // 计算相关信息
      var relatedInfoListReturn = [];
      var otherSubjectAndsub = ["其他业务收入", "其他业务支出", "税金及附加", "销售费用", "管理费用", "勘探费用", "财务费用"];
      subject.forEach((item) => {
        // 获取所有科目并计算相关信息
        let funcSubject = extrequire("AT17AF88F609C00004.operatingprofit.getProfitAll");
        let resSubject = funcSubject.execute(context, resProfitAll, [item.code], item.direct);
        let advice = "-";
        if (item.name == "主营业务收入") {
          mainIncome = MoneyFormatReturnBd(resSubject.resObject.currentPeriod / 10000, pointnumber);
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
        if (item.name == "主营业务成本") {
          mainCost = MoneyFormatReturnBd(resSubject.resObject.currentPeriod / 10000, pointnumber);
        }
        if (item.name == "税金及附加") {
          taxs = resSubject;
        }
        if (otherSubjectAndsub.includes(item.name)) {
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
        "project in ('销售（营业）利润率（%）','销售（营业）利润增长率（%）','资本收益率（%）')";
      var sqlIndustryResult = ObjectStore.queryByYonQL(sqlIndustry);
      // 计算拓展信息
      var expandInfoList = [
        { name: "核心利润", res: resCoreProfit },
        { name: "核心利润率", res: resCoreProfitRate },
        { name: "营业利润率", res: resOperatingProfitRate },
        { name: "营业利润增长率", res: resOperatingProfit },
        { name: "毛利率", res: resGrossProfitRate },
        { name: "资本收益率", res: resCapitalProfitRate }
      ];
      var businessStatus =
        "期间内公司实现利润总额" +
        MoneyFormatReturnBd(resTotalProfit.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(resTotalProfit.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        resTotalProfit.resObject.monthOnMonthGrowthRate +
        "%。营业外收入" +
        MoneyFormatReturnBd(resNonOperatingIncome.resObject.currentPeriod / 10000, pointnumber) +
        "万元，营业外支出" +
        MoneyFormatReturnBd(resNonOperatingCost.resObject.currentPeriod / 10000, pointnumber) +
        "万元。实现利润主要来自于内部经营业务。\n" +
        "营业利润为" +
        MoneyFormatReturnBd(resOperatingProfit.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(resOperatingProfit.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        resOperatingProfit.resObject.monthOnMonthGrowthRate +
        "%,营业利润率" +
        resOperatingProfitRate.resObject.currentPeriod +
        "%。\n" +
        "具体来说，以下项目的变动使营业利润增加：主营业务收入增加" +
        mainIncome +
        "万元，\n" +
        "以下项目的变动使营业利润减少：主营业务成本增加" +
        mainCost +
        "万元，\n" +
        "增加项与减少项相抵，使得营业利润增长。\n" +
        "税金及附加" +
        MoneyFormatReturnBd(taxs.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(taxs.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        taxs.resObject.monthOnMonthGrowthRate +
        "%；\n" +
        "实现净利润" +
        MoneyFormatReturnBd(resNetProfit.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(resNetProfit.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        resNetProfit.resObject.monthOnMonthGrowthRate +
        "%；\n" +
        "毛利润" +
        MoneyFormatReturnBd(resGrossProfit.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(resGrossProfit.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        resGrossProfit.resObject.monthOnMonthGrowthRate +
        "%；\n" +
        "毛利率为" +
        resGrossProfitRate.resObject.currentPeriod +
        "%,环比变化幅度" +
        resGrossProfitRate.resObject.monthOnMonthGrowthRate +
        "%。\n";
      // 在扩展信息中插入AI智能建议模板
      var param = businessStatus;
      var expandInfoListReturn = [];
      expandInfoList.forEach((item) => {
        let advice = "-";
        let excellent = "";
        let average = "";
        let poor = "";
        if (item.name == "核心利润") {
          advice =
            "其中营业收入较上期变化" +
            resIncome.resObject.monthOnMonthGrowthRate * 100 +
            "%，营业成本较上期变化" +
            resCost.resObject.monthOnMonthGrowthRate * 100 +
            "%，利息费用较上期变化" +
            resInterest.resObject.monthOnMonthGrowthRate * 100 +
            "%。";
        }
        if (item.name == "核心利润率") {
          if (item.res.resObject.monthOnMonthGrowthRate < 0) {
            let target = item.res.resObject.monthOnMonthGrowthRate * resIncome.resObject.currentPeriod;
            let increaseRate = item.res.resObject.monthOnMonthGrowthRate - item.res.resObject.currentPeriod;
            advice = "其中核心利润较上期下降" + resCoreProfit.resObject.monthOnMonthGrowthRate * -100 + "%，核心利润达到" + target + "元，核心利润率提升" + increaseRate * 100 + "%。";
          } else if (item.res.resObject.monthOnMonthGrowthRate > 0) {
            advice = "其中核心利润较上期增加" + resCoreProfit.resObject.monthOnMonthGrowthRate * 100 + "%，运营情况良好。";
          } else {
            advice = "其中核心利润较上期无变化";
          }
        }
        if (item.name == "营业利润率") {
          sqlIndustryResult.forEach((item1) => {
            if (item1.project == "销售（营业）利润率（%）") {
              excellent = GetBigDecimal(item1.excellent);
              average = GetBigDecimal(item1.average);
              poor = GetBigDecimal(item1.poor);
            }
          });
          if (item.res.resObject.monthOnMonthGrowthRate < 0) {
            let target = item.res.resObject.monthOnMonthGrowthRate * resIncome.resObject.currentPeriod;
            let increaseRate = item.res.resObject.monthOnMonthGrowthRate - item.res.resObject.currentPeriod;
            advice =
              "其中营业利润较上期减少" +
              resOperatingProfit.resObject.monthOnMonthGrowthRate * -100 +
              "%，营业利润达到" +
              target +
              "元，营业利润率提升" +
              increaseRate * 100 +
              "%。\n" +
              "建议：\n" +
              "1.	控制期间费用：通过控制期间费用，如销售费用、管理费用和财务费用等，可以降低营业成本。\n" +
              "2.	降低生产成本：通过降低生产成本。\n" +
              "3.	提高产品或服务价格：提高产品或服务价格可以增加营业收入，从而提高营业利润率";
          } else if (item.res.resObject.monthOnMonthGrowthRate > 0) {
            advice =
              "其中营业利润较上期增加" +
              resOperatingProfit.resObject.monthOnMonthGrowthRate * 100 +
              "%，运营情况良好。\n" +
              "建议：\n" +
              "1.	控制期间费用：通过控制期间费用，如销售费用、管理费用和财务费用等，可以降低营业成本。\n" +
              "2.	降低生产成本：通过降低生产成本。\n" +
              "3.	提高产品或服务价格：提高产品或服务价格可以增加营业收入，从而提高营业利润率";
          } else {
            advice = "其中核心利润较上期无变化";
          }
        }
        if (item.name == "毛利率") {
          advice = "其中营业收入较上期变化" + resIncome.resObject.monthOnMonthGrowthRate * 100 + "%，营业成本较上期变化" + resCost.resObject.monthOnMonthGrowthRate * 100 + "%";
        }
        var sub = {
          zhibiaomingchen: item.name,
          benqizhi: item.res.resObject.currentPeriod,
          huanbizengchang: item.res.resObject.monthOnMonthGrowthRate,
          tongbizengchang: item.res.resObject.yearToYearGrowthRate,
          excellent: excellent,
          average: average,
          pool: poor,
          nianleijizhi: item.res.resObject.annualAccumulation,
          param: param,
          yewujianyi: advice
        };
        if (item.name == "营业利润增长率") {
          sqlIndustryResult.forEach((item1) => {
            if (item1.project == "销售（营业）利润增长率（%）") {
              excellent = GetBigDecimal(item1.excellent);
              average = GetBigDecimal(item1.average);
              poor = GetBigDecimal(item1.poor);
            }
          });
          sub = {
            zhibiaomingchen: item.name,
            benqizhi: item.res.resObject.monthOnMonthGrowthRate,
            huanbizengchang: "",
            tongbizengchang: "",
            excellent: excellent,
            average: average,
            pool: poor,
            param: param,
            nianleijizhi: item.res.resObject.yearToYearGrowthAccumulationRate,
            yewujianyi: advice
          };
        }
        if (item.name == "资本收益率") {
          sqlIndustryResult.forEach((item1) => {
            if (item1.project == "资本收益率（%）") {
              excellent = GetBigDecimal(item1.excellent);
              average = GetBigDecimal(item1.average);
              poor = GetBigDecimal(item1.poor);
            }
          });
          sub = {
            zhibiaomingchen: item.name,
            benqizhi: item.res.resObject.monthOnMonthGrowthRate,
            huanbizengchang: item.res.resObject.monthOnMonthGrowthRate,
            tongbizengchang: item.res.resObject.yearToYearGrowthRate,
            excellent: excellent,
            average: average,
            pool: poor,
            param: param,
            nianleijizhi: item.res.resObject.annualAccumulation,
            yewujianyi: advice
          };
        }
        expandInfoListReturn.push(sub);
      });
      // 计算管理建议
      var managementAdviceList = [];
      let param1 = { name: "利润" };
      let param2 = { key: "yourkeyHere" };
      let managementAdviceHistoryFunc = extrequire("AT17AF88F609C00004.common.getManaHisInfo");
      let managementAdviceHistoryList = managementAdviceHistoryFunc.execute(param1, param2).res;
      let manAdvice = "";
      if (resGrossProfitRate.resObject.monthOnMonthGrowth > 0 && resOperatingProfitRate.resObject.monthOnMonthGrowth > 0) {
        manAdvice = "通过以上数据指标可知，企业期间内毛利率、营业利润率指标增长，可见公司获利能力增强了。\n";
      } else if (resGrossProfitRate.resObject.monthOnMonthGrowth < 0 && resOperatingProfitRate.resObject.monthOnMonthGrowth < 0) {
        manAdvice = "通过以上数据指标可知，企业期间内毛利率、营业利润率指标降低，可见公司获利能力降低了。\n";
      }
      let str =
        "利润总额" +
        MoneyFormatReturnBd(resTotalProfit.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(resTotalProfit.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        resTotalProfit.resObject.monthOnMonthGrowthRate +
        "%。营业外收入" +
        MoneyFormatReturnBd(resNonOperatingIncome.resObject.currentPeriod / 10000, pointnumber) +
        "万元，营业外支出" +
        MoneyFormatReturnBd(resNonOperatingCost.resObject.currentPeriod / 10000, pointnumber) +
        "万元。实现利润主要来自于内部经营业务。\n" +
        "营业利润为" +
        MoneyFormatReturnBd(resOperatingProfit.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(resOperatingProfit.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        resOperatingProfit.resObject.monthOnMonthGrowthRate +
        "%,营业利润率" +
        resOperatingProfitRate.resObject.currentPeriod +
        "%。\n" +
        "具体来说，以下项目的变动使营业利润增加：主营业务收入增加" +
        mainIncome +
        "万元，\n" +
        "以下项目的变动使营业利润减少：主营业务成本增加" +
        mainCost +
        "万元，\n" +
        "增加项与减少项相抵，使得营业利润增长。\n" +
        "税金及附加" +
        MoneyFormatReturnBd(taxs.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(taxs.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        taxs.resObject.monthOnMonthGrowthRate +
        "%；\n" +
        "实现净利润" +
        MoneyFormatReturnBd(resNetProfit.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(resNetProfit.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        resNetProfit.resObject.monthOnMonthGrowthRate +
        "%；\n" +
        "毛利润" +
        MoneyFormatReturnBd(resGrossProfit.resObject.currentPeriod / 10000, pointnumber) +
        "万元，较上期变化" +
        MoneyFormatReturnBd(resGrossProfit.resObject.monthOnMonthGrowth / 10000, pointnumber) +
        "万元，环比变化幅度" +
        resGrossProfit.resObject.monthOnMonthGrowthRate +
        "%；\n" +
        "毛利率为" +
        resGrossProfitRate.resObject.currentPeriod +
        "%,环比变化幅度" +
        resGrossProfitRate.resObject.monthOnMonthGrowthRate +
        "%。\n" +
        manAdvice +
        "\n" +
        "企业想增加利润最有效的策略有以下几种：\n" +
        "1.	增加销售额：通过增加销售额，提高营业收入，从而增加企业的利润，可以通过提高产品品质、提高服务水平、加强营销推广等方式来增加销售额。\n" +
        "2.	降低成本：通过优化生产流程、降低采购成本、减少浪费、控制人力成本等方式降低成本、提高企业利润\n" +
        "3.	提高生产效率：优化生产流程等方式提高生产效率，增加产量和销售额，从而提高企业利润\n" +
        "4.	增加固定资产和流动资金的使用效率：通过合理配置固定资产和流动资金，提高使用效率，以增加企业的利润。\n" +
        "5.	扩大市场份额：通过扩大市场份额，增加销售量，以提高企业的利润，可以通过加强营销推广、开拓新市场等方式来扩大市场份额。";
      var managementAdvice = { guanlijianyi1: str };
      managementAdviceList.push(managementAdvice);
      var object = [
        {
          name: "利润",
          baseInfoList: baseInfoListReturn,
          historyInfoList: historyInfoListReturn,
          detailsInfoList: relatedInfoListReturn,
          extendedInfoList: expandInfoListReturn,
          managementAdviceList: managementAdviceList,
          managementAdviceHistoryList: managementAdviceHistoryList
        }
      ];
      var res = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", object, "yb3cfbba9b");
      return { relatedInfoListReturn };
    } catch (e) {
      throw new Error("执行脚本getBackForProft2报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });