let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      //需要调用的后端脚本
      let getCosts = extrequire("AT17AF88F609C00004.yycb.getCosts");
      let getYearOnYear = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      let getMonthOnMonth = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      let dataformat = extrequire("AT17AF88F609C00004.common.dataformat");
      let getTaxes = extrequire("AT17AF88F609C00004.yycb.getTaxes");
      var result = ObjectStore.queryByYonQL("select id from AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails");
      var res = ObjectStore.deleteBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", result, "yb91379697");
      //正式入参
      let param1 = {
        org: request.org, //会计主体ID,必填
        accbook: request.accbook, // 账簿
        period1: request.period1, //起始期间,必填
        period2: request.period2 //结束期间,必填
      };
      //查询同比信息入参
      let param2 = {
        org: param1.org, //会计主体ID,必填
        accbook: param1.accbook, // 账簿
        period1: getYearOnYear.execute(param1.period1).date, //起始期间,必填
        period2: getYearOnYear.execute(param1.period2).date //结束期间,必填
      };
      //查询环比信息入参
      let param3 = {
        org: param1.org, //会计主体ID,必填
        accbook: param1.accbook, // 账簿
        period1: getMonthOnMonth.execute(param1.period1).date, //起始期间,必填
        period2: getMonthOnMonth.execute(param1.period2).date //结束期间,必填
      };
      //去年数据
      let param4 = {
        org: param1.org,
        accbook: param1.accbook,
        period1: new Date().getFullYear() - 1 + "-01",
        period2: new Date().getFullYear() - 1 + "-12"
      };
      //前年数据
      let param5 = {
        org: param1.org,
        accbook: param1.accbook,
        period1: getYearOnYear.execute(param4.period1).date,
        period2: getYearOnYear.execute(param4.period2).date
      };
      //大前年数据
      let param6 = {
        org: param1.org,
        accbook: param1.accbook,
        period1: getYearOnYear.execute(param5.period1).date,
        period2: getYearOnYear.execute(param5.period2).date
      };
      var costslist = [];
      var chengbenjine = 0;
      var feiyongjine = 0;
      var lastyearchengbenjine = 0;
      var lastyearfeiyongjine = 0;
      var lastmonthchengbenjine = 0;
      var lastmonthfeiyongjine = 0;
      var qunianchengbenjine = 0;
      var qunianfeiyongjine = 0;
      var qiannianchengbenjine = 0;
      var qiannianfeiyongjine = 0;
      var daqiannianchengbenjine = 0;
      var daqiannianfeiyongjine = 0;
      var chengbennianleiji = 0;
      var feiyongnianleiji = 0;
      var shuijinjine = 0;
      var shuijintongbi = 0;
      var shuijinhuanbi = 0;
      var shuijinnianleiji = 0;
      var historyInfoList = [];
      var managementAdviceList = [];
      var baseInfoList = [];
      var extendedInfoList = [];
      var detailsInfoList = [];
      var lastyearMap = new Map();
      var lastMonthMap = new Map();
      //历史信息
      var historyInfo = [];
      //获取成本信息
      let costs = getCosts.execute(param1);
      //去年数据
      let lastYearCosts = getCosts.execute(param2);
      //上个月数据
      let lastMonthCosts = getCosts.execute(param3);
      //去年成本费用数据
      let qunian = getCosts.execute(param4);
      let qiannian = getCosts.execute(param5);
      let daqiannian = getCosts.execute(param6);
      var chengbenCodes = ["5001", "5201", "6401"];
      var feiyongCodes = ["6601", "6602", "6603"];
      //计算去年数据
      lastYearCosts.costList.forEach((item) => {
        lastyearMap.set(item.accsubject_name, item.localdebit2);
      });
      lastMonthCosts.costList.forEach((item) => {
        lastMonthMap.set(item.accsubject_name, item.localdebit2);
      });
      qunian.costList.forEach((item) => {
        //去年成本金额
        if (chengbenCodes.includes(item.accsubject_code)) {
          qunianchengbenjine += item.localdebit2;
        }
        //去年费用金额
        if (feiyongCodes.includes(item.accsubject_code)) {
          qunianfeiyongjine += item.localdebit2;
        }
      });
      qiannian.costList.forEach((item) => {
        //前年成本金额
        if (chengbenCodes.includes(item.accsubject_code)) {
          qiannianchengbenjine += item.localdebit2;
        }
        //前年费用金额
        if (feiyongCodes.includes(item.accsubject_code)) {
          qiannianfeiyongjine += item.localdebit2;
        }
      });
      daqiannian.costList.forEach((item) => {
        //大前年成本金额
        if (chengbenCodes.includes(item.accsubject_code)) {
          daqiannianchengbenjine += item.localdebit2;
        }
        //大前年费用金额
        if (feiyongCodes.includes(item.accsubject_code)) {
          daqiannianfeiyongjine += item.localdebit2;
        }
      });
      costs.costList.forEach((item) => {
        if (chengbenCodes.includes(item.accsubject_code)) {
          chengbenjine += item.localdebit2;
          lastyearchengbenjine += lastyearMap.get(item.accsubject_name);
          lastmonthchengbenjine += lastMonthMap.get(item.accsubject_name);
          chengbennianleiji += item.localdebit4;
          var chengbendetail = {
            zhibiaomingchen: item.accsubject_name,
            benqizhi: item.localdebit2,
            tongbizengchang: dataformat.execute((((item.localdebit2 - lastyearMap.get(item.accsubject_name)) / lastyearMap.get(item.accsubject_name)) * 100).toFixed(2)).res,
            huanbizengchang: dataformat.execute((((item.localdebit2 - lastMonthMap.get(item.accsubject_name)) / lastMonthMap.get(item.accsubject_name)) * 100).toFixed(2)).res,
            nianleijizhi: item.localdebit4,
            yewujianyi: ""
          };
          detailsInfoList.push(chengbendetail);
        }
        if (feiyongCodes.includes(item.accsubject_code)) {
          feiyongjine += item.localdebit2;
          lastyearfeiyongjine += lastyearMap.get(item.accsubject_name);
          lastmonthfeiyongjine += lastMonthMap.get(item.accsubject_name);
          feiyongnianleiji += item.localdebit4;
          var feiyongdetail = {
            zhibiaomingchen: item.accsubject_name,
            benqizhi: item.localdebit2,
            tongbizengchang: dataformat.execute((((item.localdebit2 - lastyearMap.get(item.accsubject_name)) / lastyearMap.get(item.accsubject_name)) * 100).toFixed(2)).res,
            huanbizengchang: dataformat.execute((((item.localdebit2 - lastMonthMap.get(item.accsubject_name)) / lastMonthMap.get(item.accsubject_name)) * 100).toFixed(2)).res,
            nianleijizhi: item.localdebit4,
            yewujianyi: ""
          };
          detailsInfoList.push(feiyongdetail);
        }
      });
      var chengbenhistory = {
        zhibiaomingchen: "成本金额",
        yinianqian: qunianchengbenjine,
        liangnianqian: qiannianchengbenjine,
        sannianqian: daqiannianchengbenjine
      };
      var feiyonghistory = {
        zhibiaomingchen: "费用金额",
        yinianqian: qunianfeiyongjine,
        liangnianqian: qiannianfeiyongjine,
        sannianqian: daqiannianfeiyongjine
      };
      var chengbentongbihistory = {
        zhibiaomingchen: "成本同比",
        yinianqian: dataformat.execute((((qunianchengbenjine - qiannianchengbenjine) / qiannianchengbenjine) * 100).toFixed(2)).res,
        liangnianqian: dataformat.execute((((qiannianchengbenjine - daqiannianchengbenjine) / daqiannianchengbenjine) * 100).toFixed(2)).res,
        sannianqian: ""
      };
      var feiyongtongbihistory = {
        zhibiaomingchen: "费用同比",
        yinianqian: dataformat.execute((((qunianfeiyongjine - qiannianfeiyongjine) / qiannianfeiyongjine) * 100).toFixed(2)).res,
        liangnianqian: dataformat.execute((((qiannianfeiyongjine - daqiannianfeiyongjine) / daqiannianfeiyongjine) * 100).toFixed(2)).res,
        sannianqian: ""
      };
      historyInfoList.push(chengbenhistory);
      historyInfoList.push(chengbentongbihistory);
      historyInfoList.push(feiyonghistory);
      historyInfoList.push(feiyongtongbihistory);
      var chengbenxinxi = {
        zhibiaomingchen: "营业成本",
        benqizhi: chengbenjine,
        tongbizengchang: dataformat.execute((((chengbenjine - lastyearchengbenjine) / lastyearchengbenjine) * 100).toFixed(2)).res,
        huanbizengchang: dataformat.execute((((chengbenjine - lastmonthchengbenjine) / lastmonthchengbenjine) * 100).toFixed(2)).res,
        nianleijizhi: chengbennianleiji
      };
      var feiyongxinxi = {
        zhibiaomingchen: "费用金额",
        benqizhi: feiyongjine,
        tongbizengchang: dataformat.execute((((feiyongjine - lastyearfeiyongjine) / lastyearfeiyongjine) * 100).toFixed(2)).res,
        huanbizengchang: dataformat.execute((((feiyongjine - lastmonthfeiyongjine) / lastmonthfeiyongjine) * 100).toFixed(2)).res,
        nianleijizhi: feiyongnianleiji
      };
      baseInfoList.push(chengbenxinxi);
      baseInfoList.push(feiyongxinxi);
      var taxes = getTaxes.execute(param1);
      taxes.taxesList.forEach((item) => {
        shuijinjine += item.localdebit2;
        shuijinnianleiji += item.localdebit4;
      });
      var lastyeartaxes = getTaxes.execute(param2);
      taxes.taxesList.forEach((item) => {
        shuijintongbi += item.localdebit2;
      });
      var lastmonrhtaxes = getTaxes.execute(param3);
      taxes.taxesList.forEach((item) => {
        shuijinhuanbi += item.localdebit2;
      });
      var shuijinjifujia = {
        zhibiaomingchen: "税金及附加",
        benqizhi: shuijinjine,
        tongbizengchang: dataformat.execute((((shuijinjine - shuijintongbi) / shuijintongbi) * 100).toFixed(2)).res,
        huanbizengchang: dataformat.execute((((shuijinjine - shuijinhuanbi) / shuijinhuanbi) * 100).toFixed(2)).res,
        nianleijizhi: shuijinnianleiji,
        yewujianyi: ""
      };
      extendedInfoList.push(shuijinjifujia);
      var chengbenfeiyongInfo = [
        {
          name: "成本费用信息",
          historyInfoList: historyInfoList,
          managementAdviceList: managementAdviceList,
          baseInfoList: baseInfoList,
          extendedInfoList: extendedInfoList,
          detailsInfoList: detailsInfoList
        }
      ];
      var res1 = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", chengbenfeiyongInfo, "yb3cfbba9b");
      return { chengbenfeiyongInfo };
    } catch (e) {
      throw new Error(e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });