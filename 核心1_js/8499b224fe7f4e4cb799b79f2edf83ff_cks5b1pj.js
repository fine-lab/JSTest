let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      var period1 = context.period1;
      var period2 = context.period2;
      //获取资产负债类所有信息
      let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
      let resSubjectType = funcSubjectType.execute(context, "资产负债类");
      //获取计算结果
      let getCalculation = extrequire("AT17AF88F609C00004.AssetsLiabilities.getCalculation");
      //数据格式转换
      let dataformat = extrequire("AT17AF88F609C00004.common.dataformat");
      //获取所有的code
      var codes = resSubjectType.res.codes;
      context.codes = codes;
      //资产codes
      var assetCodes = resSubjectType.res.allType["资产负债类资产"].codeDebit;
      //负债codes
      var liabilityCodes = resSubjectType.res.allType["资产负债类负债"].codeCredit;
      //建议相关计算字段
      var assetmoney = 0;
      var liabilitymoney = 0;
      var monthonmonthasset = 0;
      var monthonmonthliability = 0;
      var yearonyearasset = 0;
      var yearonyearliability = 0;
      let funcProfitAll = extrequire("AT17AF88F609C00004.pubmoney.getPublicTarget");
      let resProfitAll = funcProfitAll.execute(context);
      //资产信息计算
      var assetMsg = getCalculation.execute(context, resProfitAll, assetCodes, "localdebit2", "-", "localcredebit2");
      //负债信息计算
      var liabilityMsg = getCalculation.execute(context, resProfitAll, liabilityCodes, "localcredebit2", "-", "localdebit2");
      //基本信息
      var baseInfoList = [];
      var zichanBaseInfo = {
        zhibiaomingchen: "资产总额",
        benqizhi: assetMsg.resObject.currentPeriod,
        huanbizengchang: assetMsg.resObject.monthOnMonthGrowthRate,
        tongbizengchang: assetMsg.resObject.yearToYearGrowthRate,
        nianleijizhi: assetMsg.resObject.annualAccumulation
      };
      var fuzhaiBaseInfo = {
        zhibiaomingchen: "负债总额",
        benqizhi: liabilityMsg.resObject.currentPeriod,
        huanbizengchang: liabilityMsg.resObject.monthOnMonthGrowthRate,
        tongbizengchang: liabilityMsg.resObject.yearToYearGrowthRate,
        nianleijizhi: liabilityMsg.resObject.annualAccumulation
      };
      baseInfoList.push(zichanBaseInfo);
      baseInfoList.push(fuzhaiBaseInfo);
      //扩展信息
      //获取企业绩效
      let getPerformance = extrequire("AT17AF88F609C00004.common.getPerformance");
      let projects = "'速动比率（%）','总资产报酬率（%）','总资产周转率（次）','流动资产周转率（次）','资产现金回收率（%）','已获利息倍数','现金流动负债比率（%）','总资产增长率（%）'";
      let performance = getPerformance.execute(context, projects);
      var projectsMap = new Map(JSON.parse(performance.projectsMapJSON));
      //速动比率
      let getQuickRatio = extrequire("AT17AF88F609C00004.AssetsLiabilities.getQuickRatio");
      //总资产收益率
      let getYieldRate = extrequire("AT17AF88F609C00004.AssetsLiabilities.getYieldRate");
      //总资产报酬率
      let getRateOfPay = extrequire("AT17AF88F609C00004.AssetsLiabilities.getRateOfPay");
      var rateofpay = getRateOfPay.execute(context);
      var extendedInfoList = [];
      var zongzichanbaochoulv = {
        zhibiaomingchen: "总资产报酬率",
        benqizhi: rateofpay.res.RateOfPay,
        tongbizengchang: dataformat.execute((((rateofpay.res.RateOfPay - rateofpay.res.yeartoyear) / rateofpay.res.yeartoyear) * 100).toFixed(2)).res,
        huanbizengchang: dataformat.execute((((rateofpay.res.RateOfPay - rateofpay.res.monthtomonth) / rateofpay.res.monthtomonth) * 100).toFixed(2)).res,
        nianleijizhi: "0",
        excellent: projectsMap.get("总资产报酬率（%）").excellent,
        average: projectsMap.get("总资产报酬率（%）").average,
        pool: projectsMap.get("总资产报酬率（%）").poor,
        yewujianyi:
          "总资产报酬率为" +
          rateofpay.res.RateOfPay +
          "同比上期增长" +
          dataformat.execute((((rateofpay.res.RateOfPay - rateofpay.res.monthtomonth) / rateofpay.res.monthtomonth) * 100).toFixed(2)).res +
          "\n" +
          "建议：\n1.	提高销售利润率：提高销售利润率是提高总资产报酬率的关键因素。企业可以通过提高产品品质、降低成本、加强营销等手段来提高销售利润率。\n" +
          "2.	优化资产结构：企业可以通过优化资产结构来提高总资产报酬率。这包括减少闲置资产、提高资产利用率、合理配置资本性支出等。"
      };
      var quickratio = getQuickRatio.execute(context);
      //获取同比年月
      let getYearOnYear = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      //获取环比年月
      let getMonthOnMonth = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      //同比
      let param2 = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        period1: getYearOnYear.execute(period1).date, //起始期间,必填
        period2: getYearOnYear.execute(period2).date //结束期间,必填
      };
      //环比
      let param3 = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        period1: getMonthOnMonth.execute(period1).date, //起始期间,必填
        period2: getMonthOnMonth.execute(period2).date //结束期间,必填
      };
      var lastyearquickratio = getQuickRatio.execute(param2);
      var lastmonthquickratio = getQuickRatio.execute(param3);
      var sudongbilv = {
        zhibiaomingchen: "速动比率",
        benqizhi: quickratio.sdbilv.sdvl,
        tongbizengchang: dataformat.execute((((quickratio.sdbilv.sdvl - lastyearquickratio.sdbilv.sdvl) / lastyearquickratio.sdbilv.sdvl) * 100).toFixed(2)).res,
        huanbizengchang: dataformat.execute((((quickratio.sdbilv.sdvl - lastmonthquickratio.sdbilv.sdvl) / lastmonthquickratio.sdbilv.sdvl) * 100).toFixed(2)).res,
        nianleijizhi: quickratio.sdbilv.nlj,
        excellent: projectsMap.get("速动比率（%）").excellent,
        average: projectsMap.get("速动比率（%）").average,
        pool: projectsMap.get("速动比率（%）").poor,
        yewujianyi:
          "速动比率为" +
          quickratio.sdbilv.sdvl +
          "较上期增加" +
          dataformat.execute((((quickratio.sdbilv.sdvl - lastmonthquickratio.sdbilv.sdvl) / lastmonthquickratio.sdbilv.sdvl) * 100).toFixed(2)).res +
          "\n" +
          "提高速动比率：\n1.	提高营业收入：提高营业收入来提高速动比率。这可以通过增加销售量、提高销售价格、开拓新市场等方式实现。\n" +
          "2.	降低成本：通过降低成本来提高速动比率。可以通过减少原材料采购成本、提高生产效率、降低销售费用和管理费用等方式实现。\n" +
          "降低速动比率：\n1.	提高库存水平：通过提高库存水平来降低速动比率。有助于减少现金和应收账款的占比，从而降低速动比率。"
      };
      var yieldrate = getYieldRate.execute(context);
      var zongzichanshouyilv = {
        zhibiaomingchen: "总资产收益率",
        benqizhi: yieldrate.res.yieldrate,
        tongbizengchang: dataformat.execute((((yieldrate.res.yieldrate - yieldrate.res.yearonyear) / yieldrate.res.yearonyear) * 100).toFixed(2)).res,
        huanbizengchang: dataformat.execute((((yieldrate.res.yieldrate - yieldrate.res.monthonmonth) / yieldrate.res.monthonmonth) * 100).toFixed(2)).res,
        nianleijizhi: "0",
        yewujianyi:
          "总资产收益率为" +
          yieldrate.res.yieldrate +
          "较上期增加" +
          dataformat.execute((((quickratio.sdbilv.sdvl - lastmonthquickratio.sdbilv.sdvl) / lastmonthquickratio.sdbilv.sdvl) * 100).toFixed(2)).res +
          "\n" +
          "建议：\n1.	提高资产周转率：提高资产周转率可以增加总资产的周转次数，从而提高总资产报酬率。可以通过提高生产效率、优化供应链管理、降低库存等手段来提高资产周转率。\n" +
          "2.	降低利息支出：降低利息支出可以减少总资产报酬率的扣减项。通过优化负债结构、提高负债水平、减少利息支出等手段来降低利息支出。"
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
      //总资产周转率
      var zongzichanzhouzhuanlv = {
        zhibiaomingchen: "总资产周转率",
        benqizhi: extendInfo.res.zongzichanzhouzhuanlv,
        tongbizengchang: (extendInfo.res.zongzichanzhouzhuanlv - extendInfo.res.lastYearzongzichanzhouzhuanlv) / extendInfo.res.lastYearzongzichanzhouzhuanlv,
        huanbizengchang: (extendInfo.res.zongzichanzhouzhuanlv - extendInfo.res.lastMonthzongzichanzhouzhuanlv) / extendInfo.res.lastMonthzongzichanzhouzhuanlv,
        nianleijizhi: "",
        excellent: projectsMap.get("总资产周转率（次）").excellent,
        average: projectsMap.get("总资产周转率（次）").average,
        pool: projectsMap.get("总资产周转率（次）").poor,
        yewujianyi: ""
      };
      //流动资产周转率
      var liudongzichanzhouzhuanlv = {
        zhibiaomingchen: "流动资产周转率",
        benqizhi: extendInfo.res.liudongzichanzhouzhuanlv,
        tongbizengchang: (extendInfo.res.liudongzichanzhouzhuanlv - extendInfo.res.lastYearliudongzichanzhouzhuanlv) / extendInfo.res.lastYearliudongzichanzhouzhuanlv,
        huanbizengchang: (extendInfo.res.liudongzichanzhouzhuanlv - extendInfo.res.lastMonthliudongzichanzhouzhuanlv) / extendInfo.res.lastMonthliudongzichanzhouzhuanlv,
        nianleijizhi: "",
        excellent: projectsMap.get("流动资产周转率（次）").excellent,
        average: projectsMap.get("流动资产周转率（次）").average,
        pool: projectsMap.get("流动资产周转率（次）").poor,
        yewujianyi: ""
      };
      //资金现金回收率
      var zijinxianjinhuishoulv = {
        zhibiaomingchen: "资金现金回收率",
        benqizhi: extendInfo.res.zijinxianjinhuishoulv,
        tongbizengchang: (extendInfo.res.zijinxianjinhuishoulv - extendInfo.res.lastYearzijinxianjinhuishoulv) / extendInfo.res.lastYearzijinxianjinhuishoulv,
        huanbizengchang: (extendInfo.res.zijinxianjinhuishoulv - extendInfo.res.lastMonthzijinxianjinhuishoulv) / extendInfo.res.lastMonthzijinxianjinhuishoulv,
        nianleijizhi: "",
        excellent: projectsMap.get("资产现金回收率（%）").excellent,
        average: projectsMap.get("资产现金回收率（%）").average,
        pool: projectsMap.get("资产现金回收率（%）").poor,
        yewujianyi: ""
      };
      //已获利息倍数
      var yihuolixibeishu = {
        zhibiaomingchen: "已获利息倍数",
        benqizhi: extendInfo.res.yihuolixibeishu,
        tongbizengchang: (extendInfo.res.yihuolixibeishu - extendInfo.res.lastYearyihuolixibeishu) / extendInfo.res.lastYearyihuolixibeishu,
        huanbizengchang: (extendInfo.res.yihuolixibeishu - extendInfo.res.lastMonthyihuolixibeishu) / extendInfo.res.lastMonthyihuolixibeishu,
        nianleijizhi: "",
        excellent: projectsMap.get("已获利息倍数").excellent,
        average: projectsMap.get("已获利息倍数").average,
        pool: projectsMap.get("已获利息倍数").poor,
        yewujianyi: ""
      };
      //现金流动负债比率
      var xianjinliudongfuzhaibilv = {
        zhibiaomingchen: "现金流动负债比率",
        benqizhi: extendInfo.res.xianjinliudongfuzhaibilv,
        tongbizengchang: (extendInfo.res.xianjinliudongfuzhaibilv - extendInfo.res.lastYearxianjinliudongfuzhaibilv) / extendInfo.res.lastYearxianjinliudongfuzhaibilv,
        huanbizengchang: (extendInfo.res.xianjinliudongfuzhaibilv - extendInfo.res.lastMonthxianjinliudongfuzhaibilv) / extendInfo.res.lastMonthxianjinliudongfuzhaibilv,
        nianleijizhi: "",
        excellent: projectsMap.get("现金流动负债比率（%）").excellent,
        average: projectsMap.get("现金流动负债比率（%）").average,
        pool: projectsMap.get("现金流动负债比率（%）").poor,
        yewujianyi: ""
      };
      //总资产增长率
      var zongzichanzengzhanglv = {
        zhibiaomingchen: "总资产增长率",
        benqizhi: extendInfo.res.zongzichanzengzhanglv,
        tongbizengchang: (extendInfo.res.zongzichanzengzhanglv - extendInfo.res.lastYearzongzichanzengzhanglv) / extendInfo.res.lastYearzongzichanzengzhanglv,
        huanbizengchang: (extendInfo.res.zongzichanzengzhanglv - extendInfo.res.lastMonthzongzichanzengzhanglv) / extendInfo.res.lastMonthzongzichanzengzhanglv,
        nianleijizhi: "",
        excellent: projectsMap.get("总资产增长率（%）").excellent,
        average: projectsMap.get("总资产增长率（%）").average,
        pool: projectsMap.get("总资产增长率（%）").poor,
        yewujianyi: ""
      };
      extendedInfoList.push(zongzichanbaochoulv);
      extendedInfoList.push(sudongbilv);
      extendedInfoList.push(zongzichanshouyilv);
      extendedInfoList.push(zongzichanzhouzhuanlv);
      extendedInfoList.push(liudongzichanzhouzhuanlv);
      extendedInfoList.push(zijinxianjinhuishoulv);
      extendedInfoList.push(yihuolixibeishu);
      extendedInfoList.push(xianjinliudongfuzhaibilv);
      extendedInfoList.push(zongzichanzengzhanglv);
      let getAllSubject = extrequire("AT17AF88F609C00004.common.getAllSubject");
      //建议入参
      var param4 = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        period1: period2, //起始期间,必填
        period2: period2, //结束期间,必填
        codes: assetCodes
      };
      let assetSubjectList = getAllSubject.execute(param4, "localdebit2", "-", "localcredebit2").subList;
      var assetSubjectMap = new Map();
      assetSubjectList.forEach((item) => {
        assetSubjectMap.set(item.accsubject_code, item);
      });
      var param5 = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        period1: period2, //起始期间,必填
        period2: period2, //结束期间,必填
        codes: liabilityCodes
      };
      let liabilitySubjectList = getAllSubject.execute(param5, "localcredebit2", "-", "localdebit2").subList;
      var liabilitySubjectMap = new Map();
      liabilitySubjectList.forEach((item) => {
        liabilitySubjectMap.set(item.accsubject_code, item);
      });
      //详情数据
      var detailsInfoList = [];
      var subject = resSubjectType.res.subject;
      var str1 = "";
      var str2 = "";
      subject.forEach((item) => {
        if (assetCodes.includes(item.code)) {
          //拼接建议
          var advice;
          let subdetail = assetSubjectMap.get(item.code);
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
          var assetDetailMsg = getCalculation.execute(context, resProfitAll, [item.code], "localdebit2", "-", "localcredebit2");
          var detail = {
            zhibiaomingchen: item.name,
            tongbizengchang: assetDetailMsg.resObject.yearToYearGrowthRate,
            huanbizengchang: assetDetailMsg.resObject.monthOnMonthGrowthRate,
            yewujianyi: advice,
            benqizhi: assetDetailMsg.resObject.currentPeriod,
            nianleijizhi: assetDetailMsg.resObject.annualAccumulation
          };
          str1 = str1 + item.name + assetDetailMsg.resObject.currentPeriod + "元、";
          detailsInfoList.push(detail);
        }
        if (liabilityCodes.includes(item.code)) {
          //拼接建议
          var advice;
          let subdetail = liabilitySubjectMap.get(item.code);
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
          var liabilityDetailMsg = getCalculation.execute(context, resProfitAll, [item.code], "localcredebit2", "-", "localdebit2");
          var detail = {
            zhibiaomingchen: item.name,
            tongbizengchang: liabilityDetailMsg.resObject.yearToYearGrowthRate,
            huanbizengchang: liabilityDetailMsg.resObject.monthOnMonthGrowthRate,
            yewujianyi: advice,
            benqizhi: liabilityDetailMsg.resObject.currentPeriod,
            nianleijizhi: liabilityDetailMsg.resObject.annualAccumulation
          };
          str2 = str2 + item.name + liabilityDetailMsg.resObject.currentPeriod + "元、";
          detailsInfoList.push(detail);
        }
      });
      //历史数据
      var historyInfoList = [];
      var zichanhistory = {
        zhibiaomingchen: "资产总额",
        yinianqian: assetMsg.resObject.oneYearAgo,
        liangnianqian: assetMsg.resObject.twoYearAgo,
        sannianqian: assetMsg.resObject.threeYearAgo
      };
      var fuzhaihistory = {
        zhibiaomingchen: "负债总额",
        yinianqian: liabilityMsg.resObject.oneYearAgo,
        liangnianqian: liabilityMsg.resObject.twoYearAgo,
        sannianqian: liabilityMsg.resObject.threeYearAgo
      };
      var zichantongbihistory = {
        zhibiaomingchen: "资产同比",
        yinianqian: assetMsg.resObject.oneYearAgoYearToYearGrowthRate,
        liangnianqian: assetMsg.resObject.twoYearAgoYearToYearGrowthRate,
        sannianqian: assetMsg.resObject.threeYearAgoYearToYearGrowthRate
      };
      var fuzhaitongbihistory = {
        zhibiaomingchen: "负债同比",
        yinianqian: liabilityMsg.resObject.oneYearAgoYearToYearGrowthRate,
        liangnianqian: liabilityMsg.resObject.twoYearAgoYearToYearGrowthRate,
        sannianqian: liabilityMsg.resObject.threeYearAgoYearToYearGrowthRate
      };
      historyInfoList.push(zichanhistory);
      historyInfoList.push(zichantongbihistory);
      historyInfoList.push(fuzhaihistory);
      historyInfoList.push(fuzhaitongbihistory);
      //历史建议
      let param6 = {
        name: "资产负债"
      };
      let param7 = {
        key: "yourkeyHere"
      };
      let managementAdviceHistoryFunc = extrequire("AT17AF88F609C00004.common.getManaHisInfo");
      let managementAdviceHistoryList = managementAdviceHistoryFunc.execute(param6, param7).res;
      //管理建议
      var managementAdviceList = [];
      var managementAdvice = {
        guanlijianyi1:
          "企业资产总额" +
          assetMsg.resObject.currentPeriod +
          "元，较上期变化" +
          (assetMsg.resObject.currentPeriod - assetMsg.resObject.previousPeriod).toFixed(2) +
          "元，环比变化" +
          assetMsg.resObject.monthOnMonthGrowthRate +
          "%，其中" +
          str1 +
          "\n" +
          "期间内公司负债总额" +
          liabilityMsg.resObject.currentPeriod +
          "元，较上期变化" +
          (liabilityMsg.resObject.currentPeriod - liabilityMsg.resObject.previousPeriod).toFixed(2) +
          "元，环比变化" +
          liabilityMsg.resObject.monthOnMonthGrowthRate +
          "%，主要构成为" +
          str2 +
          "\n" +
          "总资产报酬率" +
          rateofpay.res.RateOfPay +
          "%，同比变化" +
          dataformat.execute((((rateofpay.res.RateOfPay - rateofpay.res.yeartoyear) / rateofpay.res.yeartoyear) * 100).toFixed(2)).res +
          "%\n" +
          "速动比率" +
          quickratio.sdbilv.sdvl +
          "%，同比变化" +
          dataformat.execute((((quickratio.sdbilv.sdvl - lastyearquickratio.sdbilv.sdvl) / lastyearquickratio.sdbilv.sdvl) * 100).toFixed(2)).res +
          "%，通常认为正常的速动比率为1，低于1的速动比率被认为企业面临着很大的偿债风险。\n" +
          "总资产收益率" +
          yieldrate.res.yieldrate +
          "%，同比变化" +
          dataformat.execute((((yieldrate.res.yieldrate - yieldrate.res.yearonyear) / yieldrate.res.yearonyear) * 100).toFixed(2)).res +
          "%\n" +
          "资产负债率" +
          "________" +
          "%，同比变化" +
          "____" +
          "%,一般认为，资产负债率的适宜水平是0.4-0.6。\n" +
          "企业可以参考以下措施建议平衡企业资产总额\n" +
          "1.	优化资产结构：合理配置资产结构，避免过度投资或资产不足的情况。\n" +
          "2.	加强资产管理：建立健全的资产管理制度，规范资产采购、使用、处置等流程，避免资产浪费和损失。\n" +
          "3.	合理规划资金使用：合理规划资金使用，确保资金充足，避免资金短缺导致的资产总额不足，\n" +
          "4.	开展金融投资：增加资产收益，提高资产质量。\n" +
          "企业可以参考以下措施建议平衡企业负债总额：\n" +
          "1.	制定负债策略：企业需要根据自身的经营状况和财务状况，制定合理的负债策略，确定负债的规模、结构、成本和奉献等。\n" +
          "2.	提高经营效率：企业可以通过加强内部管理，提高经营效率，降低成本，增加利润，从而平衡负债总额\n" +
          "3.	控制负债成本：企业需要控制负债的成本，合理安排负债的结构，避免负债成本过高，从而影响企业的财务健康状况。"
      };
      managementAdviceList.push(managementAdvice);
      //最终数据
      var zichanfuzhai = [
        {
          name: "资产负债信息",
          historyInfoList: historyInfoList,
          managementAdviceList: managementAdviceList,
          baseInfoList: baseInfoList,
          extendedInfoList: extendedInfoList,
          detailsInfoList: detailsInfoList,
          managementAdviceHistoryList: managementAdviceHistoryList
        }
      ];
      var res = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", zichanfuzhai, "yb3cfbba9b");
      return { zichanfuzhai };
    } catch (e) {
      throw new Error("执行脚本getAssetLiab2报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });