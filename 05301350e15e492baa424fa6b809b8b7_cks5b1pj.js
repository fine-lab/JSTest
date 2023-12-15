let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      // 记录入参的开始和结束期间
      var startPeriod = context.period1;
      var endPeriod = context.period2;
      var functionPub = "AT17AF88F609C00004.operatingprofit.getProfitAll";
      // 获取 主营业务收入6001贷 主营业务成本6401借 营业外收入6301贷 营业外支出6711借 其他业务收入6051贷 其他业务支出6402借
      // 获取 公允价值变动损益6101贷 投资收益6111贷 其他收益6112贷 税金及附加6405借 销售费用6601借 管理费用6602借 财务费用6603借 勘探费用6604借 资产减值损失6701借
      // 获取 税=应交所得税222131贷+递延所得税负债2901贷-递延所得税资产1811借
      // 获取 主营业务收入6001贷  营业外收入6301贷  其他业务收入6051贷 公允价值变动损益6101贷 投资收益6111贷 其他收益6112贷 应交所得税222131贷+递延所得税负债2901贷
      // 获取 主营业务成本6401借 营业外支出6711借 其他业务支出6402借 税金及附加6405借 销售费用6601借 管理费用6602借 财务费用6603借 勘探费用6604借 资产减值损失6701借 递延所得税资产1811借
      var profitAllCode = ["6001", "6301", "6051", "6101", "6111", "6112", "222131", "2901", "6401", "6711", "6402", "6405", "6601", "6602", "6603", "6604", "6701", "1811"];
      context.codes = profitAllCode;
      let funcProfitAll = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resProfitAll = funcProfitAll.execute(context);
      // 获取营业收入 主营业务收入+其他业务收入贷方
      let funcIncome = extrequire(functionPub);
      let resIncome = funcIncome.execute(context, resProfitAll, ["6001", "6051"], "credit");
      // 获取营业成本 主营业务成本+其他业务支出借方
      let funcCost = extrequire(functionPub);
      let resCost = funcCost.execute(context, resProfitAll, ["6401", "6402"], "debit");
      // 获取营业外收入贷方
      let funcNonOperatingIncome = extrequire(functionPub);
      let resNonOperatingIncome = funcNonOperatingIncome.execute(context, resProfitAll, ["6301"], "credit");
      // 获取营业外支出借方
      let funcNonOperatingCost = extrequire(functionPub);
      let resNonOperatingCost = funcNonOperatingCost.execute(context, resProfitAll, ["6711"], "debit");
      // 获取公允价值变动损益6101贷方
      let funcFVPL = extrequire(functionPub);
      let resFVPL = funcFVPL.execute(context, resProfitAll, ["6101"], "credit");
      // 获取投资收益6111贷方
      let funcIncomeFromInvestment = extrequire(functionPub);
      let resIncomeFromInvestment = funcIncomeFromInvestment.execute(context, resProfitAll, ["6111"], "credit");
      // 获取其他收益6112贷方
      let funcOtherIncome = extrequire(functionPub);
      let resOtherIncome = funcOtherIncome.execute(context, resProfitAll, ["6112"], "credit");
      // 税金及附加6405借方
      let funcTaxesAndSurcharges = extrequire(functionPub);
      let resTaxesAndSurcharges = funcTaxesAndSurcharges.execute(context, resProfitAll, ["6405"], "debit");
      // 销售费用6601借方
      let funcSellingExpenses = extrequire(functionPub);
      let resSellingExpenses = funcSellingExpenses.execute(context, resProfitAll, ["6601"], "debit");
      // 管理费用6602借方
      let funcOverhead = extrequire(functionPub);
      let resOverhead = funcOverhead.execute(context, resProfitAll, ["6602"], "debit");
      // 财务费用6603借方
      let funcFinancialExpenses = extrequire(functionPub);
      let resFinancialExpenses = funcFinancialExpenses.execute(context, resProfitAll, ["6603"], "debit");
      // 勘探费用6604借方
      let funcExplorationExpenses = extrequire(functionPub);
      let resExplorationExpenses = funcExplorationExpenses.execute(context, resProfitAll, ["6604"], "debit");
      // 资产减值损失6701借方
      let funcImpairmentLoss = extrequire(functionPub);
      let resImpairmentLoss = funcImpairmentLoss.execute(context, resProfitAll, ["6701"], "debit");
      // 研发支出5301借方
      let funcResearchExpenses = extrequire(functionPub);
      let resResearchExpenses = funcResearchExpenses.execute(context, resProfitAll, ["5301"], "debit");
      // 获取税的指标
      // 获取税 税=应交所得税222131贷+递延所得税负债2901贷-递延所得税资产1811借
      let funcTax = extrequire("AT17AF88F609C00004.operatingprofit.getTax");
      let resTax = funcTax.execute(context, resProfitAll, ["222131", "2901"], ["1811"]);
      // 毛利润=营业收入-营业成本
      let funcGrossProfit = extrequire("AT17AF88F609C00004.operatingprofit.getTax");
      let resGrossProfit = funcGrossProfit.execute(context, resProfitAll, ["6001", "6051"], ["6401", "6402"]);
      // 营业利润=毛利润+公允价值变动收益(损失为负)+投资收益(损失为负)－营业税金及附加－管理费用－销售费用－财务费用－资产减值损失
      let funcOperatingProfit = extrequire("AT17AF88F609C00004.operatingprofit.getTax");
      let resOperatingProfit = funcOperatingProfit.execute(context, resProfitAll, ["6001", "6051", "6101", "6111", "6112"], ["6401", "6402", "6405", "6601", "6602", "6603", "6604", "6701"]);
      // 利润总额=营业利润+营业外收入6301-营业外支出6711
      let funcTotalProfit = extrequire("AT17AF88F609C00004.operatingprofit.getTax");
      let resTotalProfit = funcTotalProfit.execute(context, resProfitAll, ["6001", "6051", "6101", "6111", "6112", "6301"], ["6401", "6402", "6405", "6601", "6602", "6603", "6604", "6701", "6711"]);
      // 净利润 = 利润总额-税    税=应交所得税222131贷+递延所得税负债2901贷-递延所得税资产1811借
      let funcNetProfit = extrequire("AT17AF88F609C00004.operatingprofit.getNetProfit");
      let resNetProfit = funcNetProfit.execute(context, resTotalProfit, resTax);
      // 核心利润=营业收入-营业成本-税金及附加—销售费用-管理费用-研发费用-利息费用
      let funcCoreProfit = extrequire("AT17AF88F609C00004.operatingprofit.getTax");
      let resCoreProfit = funcCoreProfit.execute(context, resProfitAll, ["6001", "6051"], ["6401", "6402", "6405", "6601", "6602", "5301", "660302"]);
      // 核心利润率  核心利润/营业收入
      let funcCoreProfitRate = extrequire("AT17AF88F609C00004.operatingprofit.getProfitRate");
      let resCoreProfitRate = funcCoreProfitRate.execute(context, resCoreProfit, resIncome);
      // 营业利润率  营业利润/营业收入
      let funcOperatingProfitRate = extrequire("AT17AF88F609C00004.operatingprofit.getProfitRate");
      let resOperatingProfitRate = funcOperatingProfitRate.execute(context, resOperatingProfit, resIncome);
      // 毛利率  毛利润/营业收入
      let funcGrossProfitRate = extrequire("AT17AF88F609C00004.operatingprofit.getProfitRate");
      let resGrossProfitRate = funcGrossProfitRate.execute(context, resGrossProfit, resIncome);
      // 获取主营业务收入贷方
      let funcMainIncome = extrequire(functionPub);
      let resMainIncome = funcMainIncome.execute(context, resProfitAll, ["6001"], "credit");
      // 获取主营业务成本借方
      let funcMainCost = extrequire(functionPub);
      let resMainCost = funcMainCost.execute(context, resProfitAll, ["6401"], "debit");
      // 计算基本信息
      var baseInfoList = [
        { name: "毛利润", res: resGrossProfit },
        { name: "营业利润", res: resOperatingProfit },
        { name: "利润总额", res: resTotalProfit },
        { name: "净利润", res: resNetProfit }
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
        { name: "毛利润", res: resGrossProfit },
        { name: "营业利润", res: resOperatingProfit },
        { name: "利润总额", res: resTotalProfit },
        { name: "净利润", res: resNetProfit }
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
      // 计算相关信息
      var relatedInfoList = [
        { name: "营业收入", res: resIncome },
        { name: "营业成本", res: resCost },
        { name: "营业外收入", res: resNonOperatingIncome },
        { name: "营业外支出", res: resNonOperatingCost },
        { name: "公允价值变动损益", res: resFVPL },
        { name: "投资收益", res: resIncomeFromInvestment },
        { name: "其他收益", res: resOtherIncome },
        { name: "税金及附加", res: resTaxesAndSurcharges },
        { name: "销售费用", res: resSellingExpenses },
        { name: "管理费用", res: resOverhead },
        { name: "财务费用", res: resFinancialExpenses },
        { name: "勘探费用", res: resExplorationExpenses },
        { name: "资产减值损失", res: resImpairmentLoss },
        { name: "所得税", res: resTax }
      ];
      var relatedInfoListReturn = [];
      relatedInfoList.forEach((item) => {
        var sub = {
          zhibiaomingchen: item.name,
          benqizhi: item.res.resObject.currentPeriod,
          huanbizengchang: item.res.resObject.monthOnMonthGrowthRate,
          tongbizengchang: item.res.resObject.yearToYearGrowthRate,
          nianleijizhi: item.res.resObject.annualAccumulation,
          yewujianyi: ""
        };
        relatedInfoListReturn.push(sub);
      });
      // 计算拓展信息
      var expandInfoList = [
        { name: "核心利润", res: resCoreProfit },
        { name: "核心利润率", res: resCoreProfitRate },
        { name: "营业利润率", res: resOperatingProfitRate },
        { name: "毛利率", res: resGrossProfitRate },
        { name: "主营业务收入", res: resMainIncome },
        { name: "主营业务成本", res: resMainCost }
      ];
      var expandInfoListReturn = [];
      expandInfoList.forEach((item) => {
        var sub = {
          zhibiaomingchen: item.name,
          benqizhi: item.res.resObject.currentPeriod,
          huanbizengchang: item.res.resObject.monthOnMonthGrowthRate,
          tongbizengchang: item.res.resObject.yearToYearGrowthRate,
          nianleijizhi: item.res.resObject.annualAccumulation,
          yewujianyi: ""
        };
        expandInfoListReturn.push(sub);
      });
      var object = [
        {
          name: "利润",
          baseInfoList: baseInfoListReturn,
          historyInfoList: historyInfoListReturn,
          detailsInfoList: relatedInfoListReturn,
          extendedInfoList: expandInfoListReturn
        }
      ];
      var res = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", object, "yb3cfbba9b");
      return { res };
    } catch (e) {
      throw new Error("执行脚本getBackForProfit报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });