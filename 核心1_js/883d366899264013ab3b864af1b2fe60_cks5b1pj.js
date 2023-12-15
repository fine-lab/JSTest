let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    var period1 = context.period1;
    var period2 = context.period2;
    let funcSubjectType = extrequire("AT17AF88F609C00004.pubmoney.getSubjectType");
    //营业收入code
    let lirunSubjectType = funcSubjectType.execute(context, "利润类");
    var takingCodes = lirunSubjectType.res.allType["利润类营业收入"].codeCredit;
    //资产code
    let resSubjectType = funcSubjectType.execute(context, "资产负债类");
    var assetCodes = resSubjectType.res.allType["资产负债类资产"].codeDebit;
    //负债code
    var liabilityCodes = resSubjectType.res.allType["资产负债类负债"].codeCredit;
    //流动资产不需要单独或去 资产获取玩比对即可
    var currentAssetsCodes = ["1001", "1002", "1012", "1101", "1121", "1122", "1123", "1131", "1132", "1221", "1231", "1321", "1401", "1402", "1403", "1404", "1405", "1406", "1407", "1408", "1471"];
    //流动负债
    var currentLiabilitiesCodes = ["2001", "2101", "2201", "2202", "2203", "2211", "2221", "2231", "2232", "2241", "2314", "2401"];
    //利息费用
    var lixi = ["660302"];
    //研发费用
    var yanfaCodes = ["600218", "5301"];
    //营业成本code
    var operatingCostsCodes = lirunSubjectType.res.allType["利润类营业成本"].codeCredit;
    //税金及附加
    var taxesCodes = lirunSubjectType.res.allType["利润类费用税金"].codeCredit;
    //期间费用
    var periodChargeCodes = lirunSubjectType.res.allType["利润类费用期间费用"].codeCredit;
    //获取同比年月
    let getYearOnYear = extrequire("AT17AF88F609C00004.common.getYearOnYear");
    //获取环比年月
    let getMonthOnMonth = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
    //现金流量接口
    var urlNow = ObjectStore.env().url;
    let url = urlNow + "/iuap-api-gateway/yonbip/fi/ficloud/cashflowdetail/queryapi";
    let body1 = {
      accbook: context.accbook,
      conditions: [
        {
          field: "period",
          operator: "=",
          value: period1 + "--" + period2
        }
      ]
    };
    let apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body1));
    var flows = JSON.parse(apiResponse);
    var cashFlowIN = 0;
    var cashFlowOUT = 0;
    flows.data.list.forEach((item) => {
      if (item.direction == "IN") {
        cashFlowIN += item.amountorg;
      }
      if (item.direction == "OUT") {
        cashFlowOUT += item.amountorg;
      }
    });
    //经营现金流量净额
    var cashFlow = cashFlowIN - cashFlowOUT;
    //现金流量同比
    let body2 = {
      accbook: context.accbook,
      conditions: [
        {
          field: "period",
          operator: "=",
          value: getYearOnYear.execute(period1).date + "--" + getYearOnYear.execute(period2).date
        }
      ]
    };
    let apiResponse1 = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body2));
    var flows1 = JSON.parse(apiResponse1);
    var lastYearcashFlowIN = 0;
    var lastYearcashFlowOUT = 0;
    flows1.data.list.forEach((item) => {
      if (item.direction == "IN") {
        lastYearcashFlowIN += item.amountorg;
      }
      if (item.direction == "OUT") {
        lastYearcashFlowOUT += item.amountorg;
      }
    });
    //经营现金流量净额
    var lastYearcashFlow = lastYearcashFlowIN - lastYearcashFlowOUT;
    //现金流量环比
    let body3 = {
      accbook: context.accbook,
      conditions: [
        {
          field: "period",
          operator: "=",
          value: getMonthOnMonth.execute(period1).date + "--" + getMonthOnMonth.execute(period2).date
        }
      ]
    };
    let apiResponse2 = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body3));
    var flows2 = JSON.parse(apiResponse2);
    var lastMonthcashFlowIN = 0;
    var lastMonthcashFlowOUT = 0;
    flows2.data.list.forEach((item) => {
      if (item.direction == "IN") {
        lastMonthcashFlowIN += item.amountorg;
      }
      if (item.direction == "OUT") {
        lastMonthcashFlowOUT += item.amountorg;
      }
    });
    //经营现金流量净额
    var lastMonthcashFlow = lastMonthcashFlowIN - lastMonthcashFlowOUT;
    var codes = [...takingCodes, ...assetCodes, ...liabilityCodes, ...lixi, ...operatingCostsCodes, ...taxesCodes, ...periodChargeCodes];
    //获取科目数据
    let func = extrequire("AT17AF88F609C00004.common.getSubjects");
    //本期
    var param1 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: period1, //起始期间,必填
      period2: period2, //结束期间,必填
      codes: codes
    };
    let res1 = func.execute(param1);
    //同比
    var param2 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: getYearOnYear.execute(period1).date, //起始期间,必填
      period2: getYearOnYear.execute(period2).date, //结束期间,必填
      codes: codes
    };
    let res2 = func.execute(param2);
    //环比
    var param3 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: getMonthOnMonth.execute(period1).date, //起始期间,必填
      period2: getMonthOnMonth.execute(period2).date, //结束期间,必填
      codes: codes
    };
    let res3 = func.execute(param3);
    //计算本年度各项指标
    var taking = 0;
    var beginAsset = 0;
    var endAsset = 0;
    var beginCurrentAsset = 0;
    var endCurrentAsset = 0;
    var endCurrentLiabilities = 0;
    var operatingCosts = 0;
    var taxes = 0;
    var periodCharge = 0;
    var lixifeiyong = 0;
    var yanfafeiyong = 0;
    res1.forEach((item) => {
      //营业总收入取贷方
      if (takingCodes.includes(item.accsubject_code)) {
        taking += item.localcredebit2;
      }
      if (assetCodes.includes(item.accsubject_code)) {
        //期初资产总额 借方-贷方
        beginAsset += item.localdebit1 - item.localcredebit1;
        //期末资产总额 借方-贷方
        endAsset += item.localdebit3 - item.localcredebit3;
      }
      if (currentAssetsCodes.includes(item.accsubject_code)) {
        //期初流动资产总额  借方-贷方
        beginCurrentAsset += item.localdebit1 - item.localcredebit1;
        //期末流动资产总额 借方-贷方
        endCurrentAsset += item.localdebit3 - item.localcredebit3;
      }
      if (currentLiabilitiesCodes.includes(item.accsubject_code)) {
        //期末流动负债 贷方-借方
        endCurrentLiabilities += item.localcredebit3 - item.localdebit3;
      }
      if (operatingCostsCodes.includes(item.accsubject_code)) {
        //营业成本 借方
        operatingCosts += item.localdebit2;
      }
      if (taxesCodes.includes(item.accsubject_code)) {
        //税金及附加 借方
        taxes += item.localdebit2;
      }
      if (periodChargeCodes.includes(item.accsubject_code)) {
        //期间费用 借方
        periodCharge += item.localdebit2;
      }
      if (lixi.includes(item.accsubject_code)) {
        //利息费用 借方
        lixifeiyong += item.localdebit2;
      }
      if (yanfaCodes.includes(item.accsubject_code)) {
        //研发费用
        yanfafeiyong += item.localdebit2;
      }
    });
    //利润总额 = 主营业务收入 + 其他收入 - 主营业务成本 - 其他成本 - 税金及附加 - 期间费用。
    //息税前利润 = 利润总额+利息费用
    var EBIT = taking - operatingCosts - taxes - periodCharge + lixifeiyong;
    //计算同比数据
    var lastYeartaking = 0;
    var lastYearbeginAsset = 0;
    var lastYearendAsset = 0;
    var lastYearbeginCurrentAsset = 0;
    var lastYearendCurrentAsset = 0;
    var lastYearendCurrentLiabilities = 0;
    var lastYearoperatingCosts = 0;
    var lastYeartaxes = 0;
    var lastYearperiodCharge = 0;
    var lastYearlixifeiyong = 0;
    var lastYearyanfafeiyong = 0;
    res2.forEach((item) => {
      //营业总收入取贷方
      if (takingCodes.includes(item.accsubject_code)) {
        lastYeartaking += item.localcredebit2;
      }
      if (assetCodes.includes(item.accsubject_code)) {
        //期初资产总额 借方-贷方
        lastYearbeginAsset += item.localdebit1 - item.localcredebit1;
        //期末资产总额 借方-贷方
        lastYearendAsset += item.localdebit3 - item.localcredebit3;
      }
      if (currentAssetsCodes.includes(item.accsubject_code)) {
        //期初流动资产总额  借方-贷方
        lastYearbeginCurrentAsset += item.localdebit1 - item.localcredebit1;
        //期末流动资产总额 借方-贷方
        lastYearendCurrentAsset += item.localdebit3 - item.localcredebit3;
      }
      if (currentLiabilitiesCodes.includes(item.accsubject_code)) {
        //期末流动负债 贷方-借方
        lastYearendCurrentLiabilities += item.localcredebit3 - item.localdebit3;
      }
      if (operatingCostsCodes.includes(item.accsubject_code)) {
        //营业成本 借方
        lastYearoperatingCosts += item.localdebit2;
      }
      if (taxesCodes.includes(item.accsubject_code)) {
        //税金及附加 借方
        lastYeartaxes += item.localdebit2;
      }
      if (periodChargeCodes.includes(item.accsubject_code)) {
        //期间费用 借方
        lastYearperiodCharge += item.localdebit2;
      }
      if (lixi.includes(item.accsubject_code)) {
        //利息费用 借方
        lastYearlixifeiyong += item.localdebit2;
      }
      if (yanfaCodes.includes(item.accsubject_code)) {
        //研发费用
        lastYearyanfafeiyong += item.localdebit2;
      }
    });
    //利润总额 = 主营业务收入 + 其他收入 - 主营业务成本 - 其他成本 - 税金及附加 - 期间费用。
    //息税前利润 = 利润总额+利息费用
    var lastYearEBIT = lastYeartaking - lastYearoperatingCosts - lastYeartaxes - lastYearperiodCharge + lastYearlixifeiyong;
    //计算环比数据
    var lastMonthtaking = 0;
    var lastMonthbeginAsset = 0;
    var lastMonthendAsset = 0;
    var lastMonthbeginCurrentAsset = 0;
    var lastMonthendCurrentAsset = 0;
    var lastMonthendCurrentLiabilities = 0;
    var lastMonthoperatingCosts = 0;
    var lastMonthtaxes = 0;
    var lastMonthperiodCharge = 0;
    var lastMonthlixifeiyong = 0;
    var lastMonthyanfafeiyong = 0;
    res3.forEach((item) => {
      //营业总收入取贷方
      if (takingCodes.includes(item.accsubject_code)) {
        lastMonthtaking += item.localcredebit2;
      }
      if (assetCodes.includes(item.accsubject_code)) {
        //期初资产总额 借方-贷方
        lastMonthbeginAsset += item.localdebit1 - item.localcredebit1;
        //期末资产总额 借方-贷方
        lastMonthendAsset += item.localdebit3 - item.localcredebit3;
      }
      if (currentAssetsCodes.includes(item.accsubject_code)) {
        //期初流动资产总额  借方-贷方
        lastMonthbeginCurrentAsset += item.localdebit1 - item.localcredebit1;
        //期末流动资产总额 借方-贷方
        lastMonthendCurrentAsset += item.localdebit3 - item.localcredebit3;
      }
      if (currentLiabilitiesCodes.includes(item.accsubject_code)) {
        //期末流动负债 贷方-借方
        lastMonthendCurrentLiabilities += item.localcredebit3 - item.localdebit3;
      }
      if (operatingCostsCodes.includes(item.accsubject_code)) {
        //营业成本 借方
        lastMonthoperatingCosts += item.localdebit2;
      }
      if (taxesCodes.includes(item.accsubject_code)) {
        //税金及附加 借方
        lastMonthtaxes += item.localdebit2;
      }
      if (periodChargeCodes.includes(item.accsubject_code)) {
        //期间费用 借方
        lastMonthperiodCharge += item.localdebit2;
      }
      if (lixi.includes(item.accsubject_code)) {
        //利息费用 借方
        lastMonthlixifeiyong += item.localdebit2;
      }
      if (yanfaCodes.includes(item.accsubject_code)) {
        //研发费用
        lastMonthyanfafeiyong += item.localdebit2;
      }
    });
    //利润总额 = 主营业务收入 + 其他收入 - 主营业务成本 - 其他成本 - 税金及附加 - 期间费用。
    //息税前利润 = 利润总额+利息费用
    var lastMonthEBIT = lastMonthtaking - lastMonthoperatingCosts - lastMonthtaxes - lastMonthperiodCharge + lastMonthlixifeiyong;
    //拼接返回值
    var res = {
      zongzichanzhouzhuanlv: taking / ((beginAsset + endAsset) / 2),
      liudongzichanzhouzhuanlv: taking / ((beginCurrentAsset + endCurrentAsset) / 2),
      zijinxianjinhuishoulv: cashFlow / ((beginAsset + endAsset) / 2),
      yihuolixibeishu: EBIT / lixifeiyong,
      xianjinliudongfuzhaibilv: cashFlow / endCurrentLiabilities,
      zongzichanzengzhanglv: endAsset - beginAsset / beginAsset,
      yanfajingfeitouruqiangd: yanfafeiyong / taking,
      lastYearzongzichanzhouzhuanlv: lastYeartaking / ((lastYearbeginAsset + lastYearendAsset) / 2),
      lastYearliudongzichanzhouzhuanlv: lastYeartaking / ((lastYearbeginCurrentAsset + lastYearendCurrentAsset) / 2),
      lastYearzijinxianjinhuishoulv: lastYearcashFlow / ((lastYearbeginAsset + lastYearendAsset) / 2),
      lastYearyihuolixibeishu: lastYearEBIT / lastYearlixifeiyong,
      lastYearxianjinliudongfuzhaibilv: lastYearcashFlow / lastYearendCurrentLiabilities,
      lastYearzongzichanzengzhanglv: lastYearendAsset - lastYearbeginAsset / lastYearbeginAsset,
      lastYearyanfajingfeitouruqiangd: lastYearyanfafeiyong / lastYeartaking,
      lastMonthzongzichanzhouzhuanlv: lastMonthtaking / ((lastMonthbeginAsset + lastMonthendAsset) / 2),
      lastMonthliudongzichanzhouzhuanlv: lastMonthtaking / ((lastMonthbeginCurrentAsset + lastMonthendCurrentAsset) / 2),
      lastMonthzijinxianjinhuishoulv: lastMonthcashFlow / ((lastMonthbeginAsset + lastMonthendAsset) / 2),
      lastMonthyihuolixibeishu: lastMonthEBIT / lastMonthlixifeiyong,
      lastMonthxianjinliudongfuzhaibilv: lastMonthcashFlow / lastMonthendCurrentLiabilities,
      lastMonthzongzichanzengzhanglv: lastMonthendAsset - lastMonthbeginAsset / lastMonthbeginAsset,
      lastMonthyanfajingfeitouruqiangd: lastMonthyanfafeiyong / lastMonthtaking
    };
    return { res };
  }
}
exports({ entryPoint: MyTrigger });