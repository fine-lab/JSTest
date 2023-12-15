let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      var period1 = context.period1;
      var period2 = context.period2;
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(context, "成本费用类");
      var codes = resSubjectType.res.codes;
      context.codes = codes;
      //成本code
      var costCodes = resSubjectType.res.allType["成本费用类营业成本"].codeDebit;
      //费用code
      var expCodes = resSubjectType.res.allType["成本费用类费用总额"].codeDebit;
      //获取成本费用相关的信息
      let funcProfitAll = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resProfitAll = funcProfitAll.execute(context);
      let getCalculation = extrequire("AT17AF88F609C00004.AssetsLiabilities.getCalculation");
      //成本信息计算
      var costMsg = getCalculation.execute(context, resProfitAll, costCodes, "localdebit2", "", "");
      //费用信息计算
      var expMsg = getCalculation.execute(context, resProfitAll, expCodes, "localdebit2", "", "");
      //此方法获取了包含详情在内的所有数据以及建议所需的数据
      let getAllSubject = extrequire("AT17AF88F609C00004.common.getAllSubject");
      var param4 = {
        org: context.org,
        accbook: context.accbook, // 账簿
        period1: period2, //起始期间,必填
        period2: period2,
        codes: context.codes
      };
      let subjectList = getAllSubject.execute(param4, "localdebit2", "", "");
      //将数据详情存放到map中方便获取
      var allSubjectMap = new Map();
      subjectList.subList.forEach((item) => {
        allSubjectMap.set(item.accsubject_code, item);
      });
      var historyInfoList = [];
      var costhistory = {
        zhibiaomingchen: "成本",
        yinianqian: costMsg.resObject.oneYearAgo,
        liangnianqian: costMsg.resObject.twoYearAgo,
        sannianqian: costMsg.resObject.threeYearAgo
      };
      var exphistory = {
        zhibiaomingchen: "费用",
        yinianqian: expMsg.resObject.oneYearAgo,
        liangnianqian: expMsg.resObject.twoYearAgo,
        sannianqian: expMsg.resObject.threeYearAgo
      };
      var costyeartoyearhistory = {
        zhibiaomingchen: "成本同比",
        yinianqian: costMsg.resObject.oneYearAgoYearToYearGrowthRate,
        liangnianqian: costMsg.resObject.twoYearAgoYearToYearGrowthRate,
        sannianqian: costMsg.resObject.threeYearAgoYearToYearGrowthRate
      };
      var expyeartoyearhistory = {
        zhibiaomingchen: "费用同比",
        yinianqian: expMsg.resObject.oneYearAgoYearToYearGrowthRate,
        liangnianqian: expMsg.resObject.twoYearAgoYearToYearGrowthRate,
        sannianqian: expMsg.resObject.threeYearAgoYearToYearGrowthRate
      };
      historyInfoList.push(costhistory);
      historyInfoList.push(costyeartoyearhistory);
      historyInfoList.push(exphistory);
      historyInfoList.push(expyeartoyearhistory);
      //历史建议
      let param6 = {
        name: "成本"
      };
      let param7 = {
        key: "yourkeyHere"
      };
      let managementAdviceHistoryFunc = extrequire("AT17AF88F609C00004.common.getManaHisInfo");
      let managementAdviceHistoryList = managementAdviceHistoryFunc.execute(param6, param7).res;
      var baseInfoList = [];
      var costbaseinfo = {
        zhibiaomingchen: "成本",
        benqizhi: costMsg.resObject.currentPeriod,
        huanbizengchang: costMsg.resObject.monthOnMonthGrowthRate,
        tongbizengchang: costMsg.resObject.yearToYearGrowthRate,
        nianleijizhi: costMsg.resObject.annualAccumulation
      };
      var expbaseinfo = {
        zhibiaomingchen: "费用",
        benqizhi: expMsg.resObject.currentPeriod,
        huanbizengchang: expMsg.resObject.monthOnMonthGrowthRate,
        tongbizengchang: expMsg.resObject.yearToYearGrowthRate,
        nianleijizhi: expMsg.resObject.annualAccumulation
      };
      baseInfoList.push(costbaseinfo);
      baseInfoList.push(expbaseinfo);
      var extendedInfoList = [];
      let getYearOnYear = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      let getMonthOnMonth = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      let dataformat = extrequire("AT17AF88F609C00004.common.dataformat");
      //成本费用收入比 = 成本费用总额/营业收入*100%
      let shouruSubjectType = funcSubjectType.execute(context, "收入类");
      //获取营业收入
      var param5 = {
        org: context.org,
        accbook: context.accbook, // 账簿
        period1: period2, //起始期间,必填
        period2: period2,
        codes: shouruSubjectType.res.codes
      };
      //获取企业绩效
      let getPerformance = extrequire("AT17AF88F609C00004.common.getPerformance");
      let projects = "'成本费用总额占营业总收入比重（%）','成本费用利润率（%）','研发经费投入强度（%）'";
      let performance = getPerformance.execute(context, projects);
      var projectsMap = new Map(JSON.parse(performance.projectsMapJSON));
      let getCommonIncome = extrequire("AT17AF88F609C00004.pubmoney.getCommonIncome");
      let income = getCommonIncome.execute(param5);
      //成本费用总额
      let costfeesSum = costMsg.resObject.currentPeriod + expMsg.resObject.currentPeriod;
      let annualcostfeesSum = costMsg.resObject.annualAccumulation + expMsg.resObject.annualAccumulation;
      let previouscostfeesSum = costMsg.resObject.previousPeriod + expMsg.resObject.previousPeriod;
      let samePeriodcostfeesSum = costMsg.resObject.samePeriodLastYear + expMsg.resObject.samePeriodLastYear;
      let shourubi = costfeesSum / income.resObject.currentPeriod;
      let shourubilastyear = samePeriodcostfeesSum / income.resObject.samePeriodLastYear;
      let shourubilastmonth = previouscostfeesSum / income.resObject.previousPeriod;
      let shourubinianleijizhi = annualcostfeesSum / income.resObject.annualAccumulation;
      let shourubadvice = "";
      if (shourubi != null) {
        let yysrb = (income.resObject.currentPeriod - income.resObject.previousPeriod) / income.resObject.previousPeriod;
      }
      var businessStatus = "";
      var param = businessStatus;
      var chengbenfeiyongshourubi = {
        zhibiaomingchen: "成本费用收入比",
        benqizhi: shourubi,
        tongbizengchang: (shourubi - shourubilastyear) / shourubilastyear,
        huanbizengchang: (shourubi - shourubilastmonth) / shourubilastmonth,
        nianleijizhi: shourubinianleijizhi,
        excellent: projectsMap.get("成本费用总额占营业总收入比重（%）").excellent,
        average: projectsMap.get("成本费用总额占营业总收入比重（%）").average,
        pool: projectsMap.get("成本费用总额占营业总收入比重（%）").poor,
        yewujianyi: shourubadvice,
        param: param
      };
      //获取利润总额
      let getCommonProfitH = extrequire("AT17AF88F609C00004.operatingprofit.getCommonProfitH");
      let profit = getCommonProfitH.execute(param5);
      let lirunlv = profit.resObject.currentPeriod / costfeesSum;
      let lirunlvlastyear = profit.resObject.samePeriodLastYear / samePeriodcostfeesSum;
      let lirunlvlastmonth = profit.resObject.previousPeriod / previouscostfeesSum;
      let lirunlvnianeiji = profit.resObject.annualAccumulation / annualcostfeesSum;
      let lirunlvadvice = "";
      if (lirunlv != null) {
      }
      //成本费用利润率=利润总额/成本费用总额*100%
      var chengbenfeiyonglirunlv = {
        zhibiaomingchen: "成本费用利润率",
        benqizhi: lirunlv,
        tongbizengchang: (lirunlv - lirunlvlastyear) / lirunlvlastyear,
        huanbizengchang: (lirunlv - lirunlvlastmonth) / lirunlvlastmonth,
        nianleijizhi: lirunlvnianeiji,
        excellent: projectsMap.get("成本费用利润率（%）").excellent,
        average: projectsMap.get("成本费用利润率（%）").average,
        pool: projectsMap.get("成本费用利润率（%）").poor,
        yewujianyi: lirunlvadvice
      };
      //计算各种比率
      let getExtendInfo = extrequire("AT17AF88F609C00004.AssetsLiabilities.getExtendInfo");
      var infoparam = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        period1: period1, //起始期间,必填
        period2: period2 //结束期间,必填
      };
      let extendInfo = getExtendInfo.execute(infoparam);
      var yanfafeiyongtouruqiangdu = {
        zhibiaomingchen: "研发费用投入强度",
        benqizhi: extendInfo.res.yanfajingfeitouruqiangd,
        tongbizengchang: (extendInfo.res.yanfajingfeitouruqiangd - extendInfo.res.lastYearyanfajingfeitouruqiangd) / extendInfo.res.lastYearyanfajingfeitouruqiangd,
        huanbizengchang: (extendInfo.res.yanfajingfeitouruqiangd - extendInfo.res.lastMonthyanfajingfeitouruqiangd) / extendInfo.res.lastMonthyanfajingfeitouruqiangd,
        nianleijizhi: "",
        excellent: projectsMap.get("研发经费投入强度（%）").excellent,
        average: projectsMap.get("研发经费投入强度（%）").average,
        pool: projectsMap.get("研发经费投入强度（%）").poor,
        yewujianyi: lirunlvadvice
      };
      extendedInfoList.push(chengbenfeiyongshourubi);
      extendedInfoList.push(chengbenfeiyonglirunlv);
      extendedInfoList.push(yanfafeiyongtouruqiangdu);
      var detailsInfoList = [];
      var subject = resSubjectType.res.subject;
      var str1 = "";
      var str2 = "";
      subject.forEach((item) => {
        if (costCodes.includes(item.code)) {
          var advice;
          var subdetail = allSubjectMap.get(item.code);
          if (subdetail != null) {
            if (subdetail.hasOwnProperty("thisIssueValue") && subdetail.thisIssueValue != 0) {
              if (subdetail.thisIssueMax.accsubject_name != undefined) {
                advice =
                  "其中" +
                  subdetail.thisIssueMax.accsubject_name +
                  "占比最大,占比达" +
                  (subdetail.thisIssueMaxValue / subdetail.thisIssueValue) * 100 +
                  "%,该指标上期占比为" +
                  (subdetail.monthOnMonthThisIssueMaxValue / subdetail.lastIssueValue) * 100 +
                  "%";
              } else {
                advice = "";
              }
            }
          }
          var costDetailMsg = getCalculation.execute(context, resProfitAll, [item.code], "localdebit2", "", "");
          var detail = {
            zhibiaomingchen: item.name,
            tongbizengchang: costDetailMsg.resObject.yearToYearGrowthRate,
            huanbizengchang: costDetailMsg.resObject.monthOnMonthGrowthRate,
            yewujianyi: advice,
            benqizhi: costDetailMsg.resObject.currentPeriod,
            nianleijizhi: costDetailMsg.resObject.annualAccumulation
          };
          str1 =
            str1 +
            item.name +
            costDetailMsg.resObject.currentPeriod +
            "元，较上期变化" +
            (costDetailMsg.resObject.currentPeriod - costDetailMsg.resObject.previousPeriod).toFixed(2) +
            "元，环比变化" +
            costDetailMsg.resObject.monthOnMonthGrowthRate +
            "%、";
          detailsInfoList.push(detail);
        }
        if (expCodes.includes(item.code)) {
          var advice;
          var subdetail = allSubjectMap.get(item.code);
          if (subdetail != null) {
            if (subdetail.hasOwnProperty("thisIssueValue") && subdetail.thisIssueValue != 0) {
              if (subdetail.thisIssueMax.accsubject_name != undefined) {
                advice =
                  "其中" +
                  subdetail.thisIssueMax.accsubject_name +
                  "占比最大,占比达" +
                  (subdetail.thisIssueMaxValue / subdetail.thisIssueValue) * 100 +
                  "%,该指标上期占比为" +
                  (subdetail.monthOnMonthThisIssueMaxValue / subdetail.lastIssueValue) * 100 +
                  "%";
              } else {
                advice = "";
              }
            }
          }
          var expDetailMsg = getCalculation.execute(context, resProfitAll, [item.code], "localdebit2", "", "");
          var detail = {
            zhibiaomingchen: item.name,
            tongbizengchang: expDetailMsg.resObject.yearToYearGrowthRate,
            huanbizengchang: expDetailMsg.resObject.monthOnMonthGrowthRate,
            yewujianyi: advice,
            benqizhi: expDetailMsg.resObject.currentPeriod,
            nianleijizhi: expDetailMsg.resObject.annualAccumulation
          };
          str2 =
            str2 +
            item.name +
            expDetailMsg.resObject.currentPeriod +
            "元，较上期变化" +
            (expDetailMsg.resObject.currentPeriod - expDetailMsg.resObject.previousPeriod).toFixed(2) +
            "元，环比变化" +
            expDetailMsg.resObject.monthOnMonthGrowthRate +
            "%、";
          detailsInfoList.push(detail);
        }
      });
      if (!codes.includes("6401")) {
        str1 = "其中主营业务成本为0元、" + str1;
      }
      var managementAdviceList = [];
      var managementAdvice = {
        guanlijianyi1:
          "营业成本" +
          costMsg.resObject.currentPeriod +
          "万元，较上期变化" +
          (costMsg.resObject.currentPeriod - costMsg.resObject.previousPeriod).toFixed(2) +
          "万元，同比变化" +
          costMsg.resObject.yearToYearGrowthRate +
          "%；其中" +
          str1 +
          "。\n" +
          "期间费用总额" +
          expMsg.resObject.currentPeriod +
          "万元，其中" +
          str2 +
          "。\n" +
          "企业降低成本可以采取以下几种方法：\n" +
          "1.	优化供应链管理：优化供应链，减少库存成本和物流成本等。\n" +
          "2.	建立完善的成本管理制度：制定完善的成本管理制度，明确成本核算方法、成本控制标准，确保成本管理的规范化、科学化。\n" +
          "3.	加强成本数据分析：对历史数据和实际数据进行分析，发现成本变化的规律和趋势，为未来的成本管理提供参考。\n" +
          "企业控制期间费用可以通过以下几种方式：\n" +
          "1.	制定预算：制定合理的预算，并将费用分配到各个部门和项目中，以确保在预算内控制期间费用。\n" +
          "2.	限制浪费：显示公司内部的浪费，如不必要的出差、过度采购，以减少期间的费用支出。\n" +
          "3.	优化流程：通过优化公司内部流程，如：采用自动化工作流程、简化审批流程等，以减少期间费用的发生"
      };
      managementAdviceList.push(managementAdvice);
      var chengbenfeiyong = [
        {
          name: "成本费用信息",
          historyInfoList: historyInfoList,
          managementAdviceList: managementAdviceList,
          baseInfoList: baseInfoList,
          extendedInfoList: extendedInfoList,
          detailsInfoList: detailsInfoList,
          managementAdviceHistoryList: managementAdviceHistoryList
        }
      ];
      var res = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", chengbenfeiyong, "yb3cfbba9b");
      return { chengbenfeiyong };
    } catch (e) {
      throw new Error("getCostsAndExp2报错" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });