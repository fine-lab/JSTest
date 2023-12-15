let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      // 记录入参的开始和结束期间
      var startPeriod = context.period1;
      var endPeriod = context.period2;
      //年累计值(本年)
      let url = "https://www.example.com/";
      let body = {
        accbook: context.accbook,
        conditions: [
          {
            field: "period",
            operator: "=",
            value: startPeriod + "--" + endPeriod
          }
        ]
      };
      let apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var nianleiji = JSON.parse(apiResponse);
      // 对接口返回编码进行判断 0失败  200正常返回
      let code = nianleiji.code;
      if (code == 0) {
        return nianleiji.message;
      }
      //获取本期值数据(本月)
      url = "https://www.example.com/";
      body = {
        accbook: context.accbook,
        conditions: [
          {
            field: "period",
            operator: "=",
            value: endPeriod + "--" + endPeriod
          }
        ]
      };
      apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var benqizhi = JSON.parse(apiResponse);
      // 对接口返回编码进行判断 0失败  200正常返回
      code = benqizhi.code;
      if (code == 0) {
        return benqizhi.message;
      }
      //获取环比数据(上个月)
      let funcPreviousPeriodDate = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      url = "https://www.example.com/";
      body = {
        accbook: context.accbook,
        conditions: [
          {
            field: "period",
            operator: "=",
            value: funcPreviousPeriodDate.execute(endPeriod).date + "--" + funcPreviousPeriodDate.execute(endPeriod).date
          }
        ]
      };
      apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var huanbi = JSON.parse(apiResponse);
      // 对接口返回编码进行判断 0失败  200正常返回
      code = huanbi.code;
      if (code == 0) {
        return huanbi.message;
      }
      //获取同比数据(去年)
      let funcSamePeriodLastYearDate = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      url = "https://www.example.com/";
      body = {
        accbook: context.accbook,
        conditions: [
          {
            field: "period",
            operator: "=",
            value: funcSamePeriodLastYearDate.execute(startPeriod).date + "--" + funcSamePeriodLastYearDate.execute(endPeriod).date
          }
        ]
      };
      apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var tongbi = JSON.parse(apiResponse);
      // 对接口返回编码进行判断 0失败  200正常返回
      code = tongbi.code;
      if (code == 0) {
        return tongbi.message;
      }
      url = "https://www.example.com/";
      body = {
        accbook: context.accbook,
        conditions: [
          {
            field: "period",
            operator: "=",
            value: "2019-01--2019-12"
          }
        ]
      };
      apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var yijiu = JSON.parse(apiResponse);
      // 对接口返回编码进行判断 0失败  200正常返回
      code = yijiu.code;
      if (code == 0) {
        return yijiu.message;
      }
      url = "https://www.example.com/";
      body = {
        accbook: context.accbook,
        conditions: [
          {
            field: "period",
            operator: "=",
            value: "2020-01--2020-12"
          }
        ]
      };
      apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var erling = JSON.parse(apiResponse);
      // 对接口返回编码进行判断 0失败  200正常返回
      code = erling.code;
      if (code == 0) {
        return erling.message;
      }
      url = "https://www.example.com/";
      body = {
        accbook: context.accbook,
        conditions: [
          {
            field: "period",
            operator: "=",
            value: "2021-01--2021-12"
          }
        ]
      };
      apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var eryi = JSON.parse(apiResponse);
      // 对接口返回编码进行判断 0失败  200正常返回
      code = eryi.code;
      if (code == 0) {
        return eryi.message;
      }
      url = "https://www.example.com/";
      body = {
        accbook: context.accbook,
        conditions: [
          {
            field: "period",
            operator: "=",
            value: "2022-01--2022-12"
          }
        ]
      };
      apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var erer = JSON.parse(apiResponse);
      // 对接口返回编码进行判断 0失败  200正常返回
      code = erer.code;
      if (code == 0) {
        return erer.message;
      }
      // 净利润
      context.period1 = startPeriod;
      context.period2 = endPeriod;
      let funcProfitAll = extrequire("AT17AF88F609C00004.operatingprofit.getCommonProfit");
      var resfuncProfitAll = funcProfitAll.execute(context).resObject;
      // 获取收入 主营业务+其他业务收入
      var incomeCode = ["6001", "6051"];
      context.codes = incomeCode;
      context.period1 = startPeriod;
      context.period2 = endPeriod;
      let funcIncomeAll = extrequire("AT17AF88F609C00004.operatingincome.getCommonIncome");
      var resfuncIncomeAll = funcIncomeAll.execute(context).resObject;
      let zhibiaoList = ["经营性净现金流", "投资性净现金流", "筹资性净现金流"];
      var baseInfoList = [];
      var historyInfoList = [];
      var detailsInfoList = [];
      var extendedInfoList = [];
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
        let nianleijiData = nianleijifunc.execute(param1, param2).result;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: tongbi };
        let tongbifunc = extrequire("AT17AF88F609C00004.cashflow.getCash");
        let tongbiData = tongbifunc.execute(param1, param2).result;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: benqizhi };
        let benqizhifunc = extrequire("AT17AF88F609C00004.cashflow.getCash");
        let benqizhiData = benqizhifunc.execute(param1, param2).result;
        param1 = { zhibiaomingcheng: item };
        param2 = { data: huanbi };
        let huanbifunc = extrequire("AT17AF88F609C00004.cashflow.getCash");
        let huanbiData = huanbifunc.execute(param1, param2).result;
        let huanbizengchang = 0;
        if (huanbiData != 0) {
          huanbizengchang = (benqizhiData - huanbiData) / huanbiData;
        }
        let tongbizengchang = 0;
        if (tongbiData != 0) {
          tongbizengchang = (nianleijiData - tongbiData) / tongbiData;
        }
        var detailsInfo = {
          zhibiaomingchen: item,
          benqizhi: MoneyFormatReturnBd(benqizhiData, 2),
          huanbizengchang: MoneyFormatReturnBd(huanbizengchang, 2),
          tongbizengchang: MoneyFormatReturnBd(tongbizengchang, 2),
          nianleijizhi: MoneyFormatReturnBd(nianleijiData, 2),
          yewujianyi: ""
        };
        detailsInfoList.push(detailsInfo);
      });
      let zhibiaokuozhanList = ["收现比", "净现比"];
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
            advance =
              "销售商品、提供劳务收到的现金较上期减少" +
              cashHuanbi +
              "%" +
              "，若销售商品、提供劳务收到的现金达到" +
              MoneyFormatReturnBd(huanbiData / resfuncIncomeAll.previousPeriod, 2) * resfuncIncomeAll.currentPeriod +
              "元，" +
              "则收现比提升" +
              MoneyFormatReturnBd(huanbiData / resfuncIncomeAll.previousPeriod, 2) -
              MoneyFormatReturnBd(benqizhiData / resfuncIncomeAll.currentPeriod, 2) +
              "%。\n" +
              "建议：\n" +
              " 1.加强应收账款管理：通过加强应收账款管理，提高应收账款回收率，从而增加现金收入，提高收现比。\n" +
              " 2.控制存货水平：通过控制存货水平，降低存货占用资金，从而增加现金收入，提高收现比。\n" +
              " 3.优化销售渠道：通过优化销售渠道，提高销售收入现金回收比例，从而增加现金收入，提高收现比。";
          } else {
            advance =
              "销售商品、提供劳务收到的现金较上期增加" +
              cashHuanbi +
              "%" +
              "，运营情况良好。\n" +
              "建议：\n" +
              " 1.加强应收账款管理：通过加强应收账款管理，提高应收账款回收率，从而增加现金收入，提高收现比。\n" +
              " 2.控制存货水平：通过控制存货水平，降低存货占用资金，从而增加现金收入，提高收现比。\n" +
              " 3.优化销售渠道：通过优化销售渠道，提高销售收入现金回收比例，从而增加现金收入，提高收现比。";
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
        if (item == "净现比") {
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
            advance =
              "其中经营活动产生的现金流量净额较上期减少" +
              cashHuanbi +
              "%" +
              "，若经营活动产生的现金流量净额达到" +
              MoneyFormatReturnBd(huanbiData / resfuncProfitAll.previousPeriod, 2) * benqizhiData +
              "元，" +
              "则净现比提升" +
              MoneyFormatReturnBd(huanbiData / resfuncProfitAll.previousPeriod, 2) -
              MoneyFormatReturnBd(benqizhiData / resfuncProfitAll.currentPeriod, 2) +
              "%。\n" +
              "建议：\n" +
              " 1.提高净利润水平：提高净利润水平，从而提高净现比。可通过提高销售收入、降低销售成本、加强财务管理等手段实现。\n" +
              " 2.加强经营活动现金流管理：通过加强经营活动现金流管理，提高现金流入速度，降低现金流出速度，从而提高净现比。可通过加强应收账款管理、控制存货水平、优化资本支出等手段实现。";
          } else {
            advance =
              "经营活动产生的现金流量净额较上期增加" +
              cashHuanbi +
              "%" +
              "，运营情况良好。\n" +
              "建议：\n" +
              " 1.提高净利润水平：提高净利润水平，从而提高净现比。可通过提高销售收入、降低销售成本、加强财务管理等手段实现。\n" +
              " 2.加强经营活动现金流管理：通过加强经营活动现金流管理，提高现金流入速度，降低现金流出速度，从而提高净现比。可通过加强应收账款管理、控制存货水平、优化资本支出等手段实现。";
          }
          var extendedInfo = {
            zhibiaomingchen: item,
            benqizhi: MoneyFormatReturnBd(benqizhiData / resfuncProfitAll.currentPeriod, 2),
            huanbizengchang: MoneyFormatReturnBd(huanbizengchang, 2),
            tongbizengchang: MoneyFormatReturnBd(tongbizengchang, 2),
            nianleijizhi: MoneyFormatReturnBd(nianleijiData / resfuncProfitAll.annualAccumulation, 2),
            yewujianyi: advance
          };
          extendedInfoList.push(extendedInfo);
        }
      });
      var object = [
        {
          name: "现金流量",
          baseInfoList: baseInfoList,
          historyInfoList: historyInfoList,
          detailsInfoList: detailsInfoList,
          extendedInfoList: extendedInfoList
        }
      ];
      var res = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", object, "yb91379697");
      return { res };
    } catch (e) {
      throw new Error("执行脚本getBackForCash报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });