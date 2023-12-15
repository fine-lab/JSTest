let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      var guanlijianyiMap = {
        operate: 0,
        operateHuanbi: 0,
        operateTongbi: 0,
        invest: 0,
        investHuanbi: 0,
        investTongbi: 0,
        financing: 0,
        financingHuanbi: 0,
        financingTongbi: 0,
        operateIn: 0,
        investIn: 0,
        financingIn: 0,
        operateOut: 0,
        investInOut: 0,
        financingInOut: 0,
        cashInAll: 0,
        cashOutAll: 0
      };
      var cashBaseInfo = context.cashBaseInfo.result.result;
      var cashCommonInfo = context.cashCommonInfo.result.resObject;
      var nianleiji = cashBaseInfo.nianleiji;
      var benqizhi = cashBaseInfo.benqizhi;
      var huanbi = cashBaseInfo.huanbi;
      var tongbi = cashBaseInfo.tongbi;
      var yijiu = cashBaseInfo.yijiu;
      var erling = cashBaseInfo.erling;
      var eryi = cashBaseInfo.eryi;
      var erer = cashBaseInfo.erer;
      // 净利润
      var resfuncProfitAll = cashCommonInfo.resNetProfit;
      // 获取收入 主营业务+其他业务收入
      var resfuncIncomeAll = cashCommonInfo.resIncome;
      let zhibiaoList = ["经营性净现金流", "投资性净现金流", "筹资性净现金流"];
      var baseInfoList = [];
      var historyInfoList = [];
      var detailsInfoList = [];
      var extendedInfoList = [];
      var managementAdviceList = [];
      zhibiaoList.forEach((item) => {
        let param1 = { zhibiaomingcheng: item };
        let param2 = { data: nianleiji };
        let nianleijifunc = extrequire("AT17AF88F609C00004.cashflow.getCashInOutSum");
        let nianleijiData = nianleijifunc.execute(param1, param2).result;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: tongbi };
        let tongbifunc = extrequire("AT17AF88F609C00004.cashflow.getCashInOutSum");
        let tongbiData = tongbifunc.execute(param1, param2).result;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: benqizhi };
        let benqizhifunc = extrequire("AT17AF88F609C00004.cashflow.getCashInOutSum");
        let benqizhiData = benqizhifunc.execute(param1, param2).result;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: huanbi };
        let huanbifunc = extrequire("AT17AF88F609C00004.cashflow.getCashInOutSum");
        let huanbiData = huanbifunc.execute(param1, param2).result;
        let huanbizengchang = 0;
        if (huanbiData != 0) {
          huanbizengchang = (benqizhiData - huanbiData) / huanbiData;
        }
        let tongbizengchang = 0;
        if (tongbiData != 0) {
          tongbizengchang = (nianleijiData - tongbiData) / tongbiData;
        }
        let baseInfo = {
          zhibiaomingchen: item,
          benqizhi: MoneyFormatReturnBd(benqizhiData, 2),
          huanbizengchang: MoneyFormatReturnBd(huanbizengchang, 2),
          tongbizengchang: MoneyFormatReturnBd(tongbizengchang, 2),
          nianleijizhi: MoneyFormatReturnBd(nianleijiData, 2)
        };
        if (item == "经营性净现金流") {
          guanlijianyiMap.operate = benqizhiData;
          guanlijianyiMap.operateHuanbi = huanbiData;
          guanlijianyiMap.operateTongbi = tongbizengchang;
        }
        if (item == "投资性净现金流") {
          guanlijianyiMap.invest = benqizhiData;
          guanlijianyiMap.investHuanbi = huanbiData;
          guanlijianyiMap.investTongbi = tongbizengchang;
        }
        if (item == "筹资性净现金流") {
          guanlijianyiMap.financing = benqizhiData;
          guanlijianyiMap.financingHuanbi = huanbiData;
          guanlijianyiMap.financingTongbi = tongbizengchang;
        }
        baseInfoList.push(baseInfo);
        param1 = { zhibiaomingcheng: item };
        param2 = { data: yijiu };
        let yijiufunc = extrequire("AT17AF88F609C00004.cashflow.getCashInOutSum");
        let yijiuData = yijiufunc.execute(param1, param2).result;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: erling };
        let erlingfunc = extrequire("AT17AF88F609C00004.cashflow.getCashInOutSum");
        let erlingData = erlingfunc.execute(param1, param2).result;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: eryi };
        let eryifunc = extrequire("AT17AF88F609C00004.cashflow.getCashInOutSum");
        let eryiData = eryifunc.execute(param1, param2).result;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: erer };
        let ererfunc = extrequire("AT17AF88F609C00004.cashflow.getCashInOutSum");
        let ererData = ererfunc.execute(param1, param2).result;
        let zhibiaohistoryInfo = {
          zhibiaomingchen: item,
          yinianqian: MoneyFormatReturnBd(ererData, 2),
          liangnianqian: MoneyFormatReturnBd(eryiData, 2),
          sannianqian: MoneyFormatReturnBd(erlingData, 2)
        };
        historyInfoList.push(zhibiaohistoryInfo);
        let erertongbizengchang = 0;
        if (eryiData != 0) {
          erertongbizengchang = (ererData - eryiData) / eryiData;
        }
        let eryitongbizengchang = 0;
        if (erlingData != 0) {
          eryitongbizengchang = (eryiData - erlingData) / erlingData;
        }
        let erlingtongbizengchang = 0;
        if (yijiuData != 0) {
          erlingtongbizengchang = (erlingData - yijiuData) / yijiuData;
        }
        let tongbihistoryInfo = {
          zhibiaomingchen: item + "同比",
          yinianqian: MoneyFormatReturnBd(erertongbizengchang, 2),
          liangnianqian: MoneyFormatReturnBd(eryitongbizengchang, 2),
          sannianqian: MoneyFormatReturnBd(erlingtongbizengchang, 2)
        };
        historyInfoList.push(tongbihistoryInfo);
      });
      let zhibiaoxiangguanList = ["经营活动现金流入", "经营活动现金流出", "投资活动现金流入", "投资活动现金流出", "筹资活动现金流入", "筹资活动现金流出"];
      zhibiaoxiangguanList.forEach((item) => {
        let param1 = { zhibiaomingcheng: item };
        let param2 = { data: nianleiji };
        let nianleijifunc = extrequire("AT17AF88F609C00004.cashflow.getCash");
        let nianleijiData = nianleijifunc.execute(param1, param2).result.cash;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: tongbi };
        let tongbifunc = extrequire("AT17AF88F609C00004.cashflow.getCash");
        let tongbiData = tongbifunc.execute(param1, param2).result.cash;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: benqizhi };
        let benqizhifunc = extrequire("AT17AF88F609C00004.cashflow.getCash");
        let benqizhiData = benqizhifunc.execute(param1, param2).result.cash;
        let benqizhiFirstData = benqizhifunc.execute(param1, param2).result.fisrtCash;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: huanbi };
        let huanbifunc = extrequire("AT17AF88F609C00004.cashflow.getCash");
        let huanbiData = huanbifunc.execute(param1, param2).result.cash;
        let huanbiFirstData = huanbifunc.execute(param1, param2).result.fisrtCash;
        let huanbizengchang = 0;
        if (huanbiData != 0) {
          huanbizengchang = MoneyFormatReturnBd((benqizhiData - huanbiData) / huanbiData, 2);
        }
        let tongbizengchang = 0;
        if (tongbiData != 0) {
          tongbizengchang = MoneyFormatReturnBd((nianleijiData - tongbiData) / tongbiData, 2);
        }
        let firstHuanbizengchang = 0;
        if (huanbiFirstData != 0) {
          firstHuanbizengchang = MoneyFormatReturnBd((benqizhiFirstData - huanbiFirstData) / huanbiFirstData, 2);
        }
        let yewujianyi = "";
        if (item == "经营活动现金流入") {
          if (huanbiFirstData == 0) {
            yewujianyi = "其中销售商品、提供劳务收到的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元。";
          } else {
            yewujianyi = "其中销售商品、提供劳务收到的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元，环比幅度" + firstHuanbizengchang + "%。";
          }
          guanlijianyiMap.operateIn = benqizhiData;
        }
        if (item == "经营活动现金流出") {
          if (huanbiFirstData == 0) {
            yewujianyi = "其中购买商品、接受劳务支付的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元。";
          } else {
            yewujianyi = "其中购买商品、接受劳务支付的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元，环比幅度" + firstHuanbizengchang + "%。";
          }
          guanlijianyiMap.operateOut = benqizhiData;
        }
        if (item == "投资活动现金流入") {
          if (huanbiFirstData == 0) {
            yewujianyi = "其中收回投资收到的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元。";
          } else {
            yewujianyi = "其中收回投资收到的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元，环比幅度" + firstHuanbizengchang + "%。";
          }
          guanlijianyiMap.investIn = benqizhiData;
        }
        if (item == "投资活动现金流出") {
          if (huanbiFirstData == 0) {
            yewujianyi = "其中购建固定资产、无形资产和其他长期资产支付的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元。";
          } else {
            yewujianyi =
              "其中购建固定资产、无形资产和其他长期资产支付的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元，环比幅度" + firstHuanbizengchang + "%。";
          }
          guanlijianyiMap.investInOut = benqizhiData;
        }
        if (item == "筹资活动现金流入") {
          if (huanbiFirstData == 0) {
            yewujianyi = "其中吸收投资收到的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元。";
          } else {
            yewujianyi = "其中吸收投资收到的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元，环比幅度" + firstHuanbizengchang + "%。";
          }
          guanlijianyiMap.financingIn = benqizhiData;
        }
        if (item == "筹资活动现金流出") {
          if (huanbiFirstData == 0) {
            yewujianyi = "其中偿还债务支付的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元。";
          } else {
            yewujianyi = "其中偿还债务支付的现金" + benqizhiData + "万元，较上期变化" + (benqizhiFirstData - huanbiFirstData) + "万元，环比幅度" + firstHuanbizengchang + "%。";
          }
          guanlijianyiMap.financingInOut = benqizhiData;
        }
        var detailsInfo = {
          zhibiaomingchen: item,
          benqizhi: MoneyFormatReturnBd(benqizhiData, 2),
          huanbizengchang: MoneyFormatReturnBd(huanbizengchang, 2),
          tongbizengchang: MoneyFormatReturnBd(tongbizengchang, 2),
          nianleijizhi: MoneyFormatReturnBd(nianleijiData, 2),
          yewujianyi: yewujianyi
        };
        detailsInfoList.push(detailsInfo);
      });
      let zhibiaokuozhanList = ["收现比", "盈余现金保障倍数"];
      zhibiaokuozhanList.forEach((item) => {
        // 收现比：销售商品、提供劳务收到的现金/营业收入
        //净现比：经营活动产生的现金流量净额/净利润。
        if (item == "收现比") {
          let param1 = { zhibiaomingcheng: item };
          let param2 = { data: nianleiji };
          let nianleijifunc = extrequire("AT17AF88F609C00004.cashflow.getCashForSale");
          let nianleijiData = nianleijifunc.execute(param1, param2).result;
          param1 = { zhibiaomingcheng: item };
          param2 = { data: tongbi };
          let tongbifunc = extrequire("AT17AF88F609C00004.cashflow.getCashForSale");
          let tongbiData = tongbifunc.execute(param1, param2).result;
          param1 = { zhibiaomingcheng: item };
          param2 = { data: benqizhi };
          let benqizhifunc = extrequire("AT17AF88F609C00004.cashflow.getCashForSale");
          let benqizhiData = benqizhifunc.execute(param1, param2).result;
          param1 = { zhibiaomingcheng: item };
          param2 = { data: huanbi };
          let huanbifunc = extrequire("AT17AF88F609C00004.cashflow.getCashForSale");
          let huanbiData = huanbifunc.execute(param1, param2).result;
          let huanbizengchang = 0;
          if (huanbiData / resfuncIncomeAll.previousPeriod != 0) {
            huanbizengchang = (benqizhiData / resfuncIncomeAll.currentPeriod - huanbiData / resfuncIncomeAll.previousPeriod) / (huanbiData / resfuncIncomeAll.previousPeriod);
          }
          let tongbizengchang = 0;
          if (tongbiData / resfuncIncomeAll.samePeriodLastYear != 0) {
            tongbizengchang = (nianleijiData / resfuncIncomeAll.annualAccumulation - tongbiData / resfuncIncomeAll.samePeriodLastYear) / (tongbiData / resfuncIncomeAll.samePeriodLastYear);
          }
          let advance = "";
          let cashHuanbi = 0;
          if (huanbiData != 0) {
            cashHuanbi = MoneyFormatReturnBd((benqizhiData - huanbiData) / huanbiData, 2);
          }
          if (benqizhiData < huanbiData) {
            let yuan = MoneyFormatReturnBd((huanbiData / resfuncIncomeAll.previousPeriod) * resfuncIncomeAll.currentPeriod, 2);
            let percent = MoneyFormatReturnBd(huanbiData / resfuncIncomeAll.previousPeriod, 2) - MoneyFormatReturnBd(benqizhiData / resfuncIncomeAll.currentPeriod, 2);
            advance =
              "销售商品、提供劳务收到的现金较上期减少" +
              cashHuanbi +
              "%" +
              "，若销售商品、提供劳务收到的现金达到" +
              yuan +
              "元，" +
              "则收现比提升" +
              percent +
              "%。\n" +
              "建议：\n" +
              " 1.加强应收账款管理：通过加强应收账款管理，提高应收账款回收率，从而增加现金收入，提高收现比。\n" +
              " 2.控制存货水平：通过控制存货水平，降低存货占用资金，从而增加现金收入，提高收现比。";
          } else {
            advance =
              "销售商品、提供劳务收到的现金较上期增加" +
              cashHuanbi +
              "%" +
              "，运营情况良好。\n" +
              "建议：\n" +
              " 1.加强应收账款管理：通过加强应收账款管理，提高应收账款回收率，从而增加现金收入，提高收现比。\n" +
              " 2.控制存货水平：通过控制存货水平，降低存货占用资金，从而增加现金收入，提高收现比。";
          }
          var extendedInfo = {
            zhibiaomingchen: item,
            benqizhi: MoneyFormatReturnBd(benqizhiData / resfuncIncomeAll.currentPeriod, 2),
            huanbizengchang: MoneyFormatReturnBd(huanbizengchang, 2),
            tongbizengchang: MoneyFormatReturnBd(tongbizengchang, 2),
            nianleijizhi: MoneyFormatReturnBd(nianleijiData / resfuncIncomeAll.annualAccumulation, 2),
            yewujianyi: advance
          };
          extendedInfoList.push(extendedInfo);
        }
        if (item == "盈余现金保障倍数") {
          let param1 = { zhibiaomingcheng: item };
          let param2 = { data: nianleiji };
          let nianleijifunc = extrequire("AT17AF88F609C00004.cashflow.getCashForProfit");
          let nianleijiData = nianleijifunc.execute(param1, param2).result;
          param1 = { zhibiaomingcheng: item };
          param2 = { data: tongbi };
          let tongbifunc = extrequire("AT17AF88F609C00004.cashflow.getCashForProfit");
          let tongbiData = tongbifunc.execute(param1, param2).result;
          param1 = { zhibiaomingcheng: item };
          param2 = { data: benqizhi };
          let benqizhifunc = extrequire("AT17AF88F609C00004.cashflow.getCashForProfit");
          let benqizhiData = benqizhifunc.execute(param1, param2).result;
          param1 = { zhibiaomingcheng: item };
          param2 = { data: huanbi };
          let huanbifunc = extrequire("AT17AF88F609C00004.cashflow.getCashForProfit");
          let huanbiData = huanbifunc.execute(param1, param2).result;
          let huanbizengchang = 0;
          if (huanbiData / resfuncProfitAll.previousPeriod != 0) {
            huanbizengchang = (benqizhiData / resfuncProfitAll.currentPeriod - huanbiData / resfuncProfitAll.previousPeriod) / (huanbiData / resfuncProfitAll.previousPeriod);
          }
          let tongbizengchang = 0;
          if (tongbiData / resfuncProfitAll.samePeriodLastYear != 0) {
            tongbizengchang = (nianleijiData / resfuncProfitAll.annualAccumulation - tongbiData / resfuncProfitAll.samePeriodLastYear) / (tongbiData / resfuncProfitAll.samePeriodLastYear);
          }
          let advance = "";
          let cashHuanbi = 0;
          if (huanbiData != 0) {
            cashHuanbi = MoneyFormatReturnBd((benqizhiData - huanbiData) / huanbiData, 2);
          }
          if (benqizhiData < huanbiData) {
            let yuan = MoneyFormatReturnBd((huanbiData / resfuncProfitAll.previousPeriod) * benqizhiData, 2);
            let percent = MoneyFormatReturnBd(MoneyFormatReturnBd(huanbiData / resfuncProfitAll.previousPeriod, 2) - MoneyFormatReturnBd(benqizhiData / resfuncProfitAll.currentPeriod, 2), 2);
            advance =
              "其中经营活动产生的现金流量净额较上期减少" +
              cashHuanbi +
              "%" +
              "，若经营活动产生的现金流量净额达到" +
              yuan +
              "元，" +
              "则净现比提升" +
              percent +
              "%。\n" +
              "建议：\n" +
              " 1.提高净利润水平：提高净利润水平，从而提高净现比。可通过提高销售收入、降低销售成本、加强财务管理等手段实现。\n" +
              " 2.加强经营活动现金流管理：通过加强经营活动现金流管理，提高现金流入速度，降低现金流出速度，从而提高净现比。";
          } else {
            advance =
              "经营活动产生的现金流量净额较上期增加" +
              cashHuanbi +
              "%" +
              "，运营情况良好。\n" +
              "建议：\n" +
              " 1.提高净利润水平：提高净利润水平，从而提高净现比。可通过提高销售收入、降低销售成本、加强财务管理等手段实现。\n" +
              " 2.加强经营活动现金流管理：通过加强经营活动现金流管理，提高现金流入速度，降低现金流出速度，从而提高净现比。";
          }
          let industryLevel1 = context.allParam.industryLevel1;
          let industryLevel2 = context.allParam.industryLevel2;
          let industryLevel3 = context.allParam.industryLevel3;
          let industryLevel4 = context.allParam.industryLevel4;
          let enterpriseSize = context.allParam.enterpriseSize;
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
            "project in ('盈余现金保障倍数')";
          var sqlIndustryResult = ObjectStore.queryByYonQL(sqlIndustry);
          let excellent = "";
          let average = "";
          let poor = "";
          sqlIndustryResult.forEach((item1) => {
            excellent = GetBigDecimal(item1.excellent);
            average = GetBigDecimal(item1.average);
            poor = GetBigDecimal(item1.poor);
          });
          var extendedInfo = {
            zhibiaomingchen: item,
            benqizhi: MoneyFormatReturnBd(benqizhiData / resfuncProfitAll.currentPeriod, 2),
            huanbizengchang: MoneyFormatReturnBd(huanbizengchang, 2),
            tongbizengchang: MoneyFormatReturnBd(tongbizengchang, 2),
            nianleijizhi: MoneyFormatReturnBd(nianleijiData / resfuncProfitAll.annualAccumulation, 2),
            excellent: excellent,
            average: average,
            pool: poor,
            yewujianyi: advance
          };
          extendedInfoList.push(extendedInfo);
        }
      });
      let param1 = { name: "现金流量" };
      let param2 = { key: "yourkeyHere" };
      let managementAdviceHistoryFunc = extrequire("AT17AF88F609C00004.common.getManaHisInfo");
      let managementAdviceHistoryList = managementAdviceHistoryFunc.execute(param1, param2).res;
      guanlijianyiMap.cashInAll = guanlijianyiMap.operateIn + guanlijianyiMap.investIn + guanlijianyiMap.financingIn;
      guanlijianyiMap.cashOutAll = guanlijianyiMap.operateOut + guanlijianyiMap.investInOut + guanlijianyiMap.financingInOut;
      let investInPercent = 0;
      let operateInPercent = 0;
      let financingInPercent = 0;
      let operateOutPercent = 0;
      let investInOutPercent = 0;
      let financingInOutPercent = 0;
      if (guanlijianyiMap.cashInAll != 0) {
        investInPercent = MoneyFormatReturnBd(guanlijianyiMap.operateIn / guanlijianyiMap.cashInAll, 2);
        operateInPercent = MoneyFormatReturnBd(guanlijianyiMap.investIn / guanlijianyiMap.cashInAll, 2);
        financingInPercent = MoneyFormatReturnBd(guanlijianyiMap.financingIn / guanlijianyiMap.cashInAll, 2);
      }
      if (guanlijianyiMap.cashOutAll != 0) {
        operateOutPercent = MoneyFormatReturnBd(guanlijianyiMap.operateOut / guanlijianyiMap.cashOutAll, 2);
        investInOutPercent = MoneyFormatReturnBd(guanlijianyiMap.investInOut / guanlijianyiMap.cashOutAll, 2);
        financingInOutPercent = MoneyFormatReturnBd(guanlijianyiMap.financingInOut / guanlijianyiMap.cashOutAll, 2);
      }
      let operatePercent = guanlijianyiMap.operate - guanlijianyiMap.operateHuanbi;
      let investPercent = guanlijianyiMap.invest - guanlijianyiMap.investHuanbi;
      let financingPercent = guanlijianyiMap.financing - guanlijianyiMap.financingHuanbi;
      let str =
        "     经营性活动现金流量净额 " +
        guanlijianyiMap.operate +
        " 万元，较上期变化 " +
        operatePercent +
        " 万元，同比变化 " +
        guanlijianyiMap.operateTongbi +
        "%。增长率越高，说明企业成长性越好。\n" +
        "     投资性活动现金流量净额 " +
        guanlijianyiMap.invest +
        " 万元，较上期变化 " +
        investPercent +
        " 万元，同比变化 " +
        guanlijianyiMap.investTongbi +
        "%。\n" +
        "     筹资性活动现金流量净额 " +
        guanlijianyiMap.financing +
        " 万元，较上期变化 " +
        financingPercent +
        " 万元，同比变化 " +
        guanlijianyiMap.financingTongbi +
        "%； \n" +
        "     经营性活动现金流入为 " +
        guanlijianyiMap.operateIn +
        " 万元，占现金总流入 " +
        operateInPercent +
        "%；\n" +
        "     投资性活动现金流入为 " +
        guanlijianyiMap.investIn +
        " 万元，占现金总流入 " +
        investInPercent +
        "%；\n" +
        "     筹资性活动现金流入为 " +
        guanlijianyiMap.financingIn +
        " 万元，占现金总流入 " +
        financingInPercent +
        "%；\n" +
        "         一般来说，经营活动现金流入占现金总流入比重大，经营状况较好，财务风险较低，现金流入结构较为合理。\n" +
        "     经营性活动现金流出为 " +
        guanlijianyiMap.operateOut +
        " 万元，占现金总流出 " +
        operateOutPercent +
        "%；\n" +
        "     投资性活动现金流出为 " +
        guanlijianyiMap.investInOut +
        " 万元，占现金总流出 " +
        investInOutPercent +
        "%；\n" +
        "     筹资性活动现金流出为 " +
        guanlijianyiMap.financingInOut +
        " 万元，占现金总流出 " +
        financingInOutPercent +
        "%；\n" +
        "         一般来说，经营活动现金支出比重大，生产经营状况正常，现金支出结构较为合理。\n" +
        "     企业可以通过以下方式提高现金流：\n" +
        "           1.优化现金流管理：企业需要建立完善的现金流管理体系、包括制定现金流预算、监测现金流情况、控制现金流风险等。提高现金流的稳定性和安全性。\n" +
        "           2.缩短销售回款周期：企业可以通过优化销售流程、缩短销售回款周期，从而提高现金流。\n" +
        "           3.管理应付账款：企业可以通过合理控制应付款项的金额和付款时间，延迟支付或采用分期付款等方式，减轻企业资金压力，提高现金流。\n" +
        "           4.减少库存：优化库存管理，减少库存积压，避免过度投资，释放现金流。\n" +
        "           5.投资收益：企业可以通过投资有稳定收益的项目，提高现金流。\n" +
        "           6.筹资资金：企业可以通过股权筹资、发行债券等方式，筹集资金来提高现金流。\n" +
        "     注意: \n" +
        "           1.不同企业的具体情况不同，选择合适的提高现金流的途径需要综合考虑多种因素，如市场需求、竞争状况、企业财务状况等。\n" +
        "           2.企业需要建立良好的现金流管理机制，确保现金流的稳定性和安全性。";
      var managementAdvice = { guanlijianyi1: str };
      managementAdviceList.push(managementAdvice);
      var object = [
        {
          name: "现金流量",
          baseInfoList: baseInfoList,
          historyInfoList: historyInfoList,
          detailsInfoList: detailsInfoList,
          extendedInfoList: extendedInfoList,
          managementAdviceList: managementAdviceList,
          managementAdviceHistoryList: managementAdviceHistoryList
        }
      ];
      var res = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", object, "yb3cfbba9b");
      return { res };
    } catch (e) {
      throw new Error("执行脚本getBackForCash报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });