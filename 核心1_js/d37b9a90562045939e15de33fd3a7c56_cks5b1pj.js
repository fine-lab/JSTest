let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      //调用方法
      let getAssetLiab = extrequire("AT17AF88F609C00004.AssetsLiabilities.getAssetLiab");
      //获取同比年月
      let getYearOnYear = extrequire("AT17AF88F609C00004.common.getYearOnYear");
      //获取环比年月
      let getMonthOnMonth = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      let dataformat = extrequire("AT17AF88F609C00004.common.dataformat");
      //速动比率
      let getQuickRatio = extrequire("AT17AF88F609C00004.AssetsLiabilities.getQuickRatio");
      //总资产收益率
      let getYieldRate = extrequire("AT17AF88F609C00004.AssetsLiabilities.getYieldRate");
      //总资产报酬率
      let getRateOfPay = extrequire("AT17AF88F609C00004.AssetsLiabilities.getRateOfPay");
      //入参
      let param1 = {
        org: request.org, //"2293903580617728",    //会计主体ID,必填
        accbook: request.accbook, //"1E0644D3-1237-464E-AB1D-0972D3C0B4E3",  // 账簿
        period1: request.period1, //"2023-03",  //起始期间,必填
        period2: request.period2 //"2023-05"  //结束期间,必填
      };
      //同比
      let param2 = {
        org: param1.org, //会计主体ID,必填
        accbook: param1.accbook, // 账簿
        period1: getYearOnYear.execute(param1.period1).date, //起始期间,必填
        period2: getYearOnYear.execute(param1.period2).date //结束期间,必填
      };
      //环比
      let param3 = {
        org: param1.org, //会计主体ID,必填
        accbook: param1.accbook, // 账簿
        period1: getMonthOnMonth.execute(param1.period1).date, //起始期间,必填
        period2: getMonthOnMonth.execute(param1.period2).date //结束期间,必填
      };
      //去年
      let param4 = {
        org: param1.org,
        accbook: param1.accbook,
        period1: new Date().getFullYear() - 1 + "-01",
        period2: new Date().getFullYear() - 1 + "-12"
      };
      //前年
      let param5 = {
        org: param1.org,
        accbook: param1.accbook,
        period1: getYearOnYear.execute(param4.period1).date,
        period2: getYearOnYear.execute(param4.period2).date
      };
      //大前年
      let param7 = {
        org: param1.org,
        accbook: param1.accbook,
        period1: getYearOnYear.execute(param5.period1).date,
        period2: getYearOnYear.execute(param5.period2).date
      };
      let res = getAssetLiab.execute(param1);
      let lastyearres = getAssetLiab.execute(param2);
      let lastmonthres = getAssetLiab.execute(param3);
      let qunian = getAssetLiab.execute(param4);
      let qiannian = getAssetLiab.execute(param5);
      let daqiannian = getAssetLiab.execute(param7);
      var zichanList = ["1122", "1012", "1101", "1121", "1123", "1221", "1531", "1511", "1521", "1601", "1604", "1701", "1801", "1811"]; //资产
      var fuzhaiList = ["2001", "2201", "2202", "2203", "2211", "2231", "2232", "2241", "2501", "2701"]; //负债
      var zichanzonge = 0;
      var fuzhaizonge = 0;
      var zichannianleiji = 0;
      var fuzhainianleiji = 0;
      var lastyearzichan = 0;
      var lastmonthzichan = 0;
      var lastyearfuzhai = 0;
      var lastmonthfuzhai = 0;
      var qunianzichan = 0;
      var qunianfuzhai = 0;
      var qiannianzichan = 0;
      var qiannianfuzhai = 0;
      var daqiannianzichan = 0;
      var daqiannianfuzhai = 0;
      var historyInfoList = [];
      var managementAdviceList = [];
      var baseInfoList = [];
      var extendedInfoList = [];
      var detailsInfoList = [];
      var lastyeardetailMap = new Map();
      var lastmonthdetailMap = new Map();
      //取同比数据
      lastyearres.res.forEach((item) => {
        if (zichanList.includes(item.accsubject_code)) {
          lastyeardetailMap.set(item.accsubject_code, item.localdebit2 - item.localcredebit2);
        }
        if (fuzhaiList.includes(item.accsubject_code)) {
          lastyeardetailMap.set(item.accsubject_code, item.localcredebit2 - item.localdebit2);
        }
      });
      //取环比数据
      lastmonthres.res.forEach((item) => {
        if (zichanList.includes(item.accsubject_code)) {
          lastmonthdetailMap.set(item.accsubject_code, item.localdebit2 - item.localcredebit2);
        }
        if (fuzhaiList.includes(item.accsubject_code)) {
          lastmonthdetailMap.set(item.accsubject_code, item.localcredebit2 - item.localdebit2);
        }
      });
      //取去年数据
      qunian.res.forEach((item) => {
        if (zichanList.includes(item.accsubject_code)) {
          qunianzichan += item.localdebit2 - item.localcredebit2;
        }
        if (fuzhaiList.includes(item.accsubject_code)) {
          qunianfuzhai += item.localcredebit2 - item.localdebit2;
        }
      });
      //计算前年同比数据值
      qiannian.res.forEach((item) => {
        if (zichanList.includes(item.accsubject_code)) {
          qiannianzichan += item.localdebit2 - item.localcredebit2;
        }
        if (fuzhaiList.includes(item.accsubject_code)) {
          qiannianfuzhai += item.localcredebit2 - item.localdebit2;
        }
      });
      //计算大前年
      daqiannian.res.forEach((item) => {
        if (zichanList.includes(item.accsubject_code)) {
          daqiannianzichan += item.localdebit2 - item.localcredebit2;
        }
        if (fuzhaiList.includes(item.accsubject_code)) {
          daqiannianfuzhai += item.localcredebit2 - item.localdebit2;
        }
      });
      //取详情以及基本信息数据
      res.res.forEach((item) => {
        if (zichanList.includes(item.accsubject_code)) {
          var zichan = item.localdebit2 - item.localcredebit2;
          zichanzonge += zichan;
          zichannianleiji += item.localdebit4;
          // 计算资产同比 环比
          lastyearzichan += lastyeardetailMap.get(item.accsubject_code);
          lastmonthzichan += lastmonthdetailMap.get(item.accsubject_code);
          var detail = {
            zhibiaomingchen: item.accsubject_name,
            tongbizengchang: dataformat.execute((((zichan - lastyeardetailMap.get(item.accsubject_code)) / lastyeardetailMap.get(item.accsubject_code)) * 100).toFixed(2)).res, //todo
            huanbizengchang: dataformat.execute((((zichan - lastmonthdetailMap.get(item.accsubject_code)) / lastyeardetailMap.get(item.accsubject_code)) * 100).toFixed(2)).res,
            yewujianyi: "建议",
            benqizhi: zichan,
            nianleijizhi: item.localdebit4
          };
          detailsInfoList.push(detail);
        }
        if (fuzhaiList.includes(item.accsubject_code)) {
          var fuzhai = item.localcredebit2 - item.localdebit2;
          fuzhaizonge += fuzhai;
          fuzhainianleiji += item.localdebit4;
          // 计算负债同比 环比
          lastyearfuzhai += lastyeardetailMap.get(item.accsubject_code);
          lastmonthfuzhai += lastmonthdetailMap.get(item.accsubject_code);
          var detail = {
            zhibiaomingchen: item.accsubject_name,
            tongbizengchang: dataformat.execute((((fuzhai - lastyeardetailMap.get(item.accsubject_code)) / lastyeardetailMap.get(item.accsubject_code)) * 100).toFixed(2)).res, //todo
            huanbizengchang: dataformat.execute((((fuzhai - lastmonthdetailMap.get(item.accsubject_code)) / lastmonthdetailMap.get(item.accsubject_code)) * 100).toFixed(2)).res,
            yewujianyi: "建议",
            benqizhi: fuzhai,
            nianleijizhi: item.localdebit4
          };
          detailsInfoList.push(detail);
        }
      });
      var zichanBaseInfo = {
        zhibiaomingchen: "资产总额",
        benqizhi: zichanzonge,
        huanbizengchang: dataformat.execute((((zichanzonge - lastmonthzichan) / lastmonthzichan) * 100).toFixed(2)).res,
        tongbizengchang: dataformat.execute((((zichanzonge - lastyearzichan) / lastyearzichan) * 100).toFixed(2)).res,
        nianleijizhi: zichannianleiji
      };
      var fuzhaiBaseInfo = {
        zhibiaomingchen: "负债总额",
        benqizhi: fuzhaizonge,
        huanbizengchang: dataformat.execute((((fuzhaizonge - lastmonthfuzhai) / lastmonthfuzhai) * 100).toFixed(2)).res,
        tongbizengchang: dataformat.execute((((fuzhaizonge - lastyearfuzhai) / lastyearfuzhai) * 100).toFixed(2)).res,
        nianleijizhi: fuzhainianleiji
      };
      baseInfoList.push(zichanBaseInfo);
      baseInfoList.push(fuzhaiBaseInfo);
      var zichanhistory = {
        zhibiaomingchen: "资产总额",
        yinianqian: qunianzichan,
        liangnianqian: qiannianzichan,
        sannianqian: daqiannianzichan
      };
      var fuzhaihistory = {
        zhibiaomingchen: "负债总额",
        yinianqian: qunianfuzhai,
        liangnianqian: qiannianfuzhai,
        sannianqian: daqiannianfuzhai
      };
      var zichantongbihistory = {
        zhibiaomingchen: "资产同比",
        yinianqian: dataformat.execute((((qunianzichan - qiannianzichan) / qiannianzichan) * 100).toFixed(2)).res,
        liangnianqian: dataformat.execute((((qiannianzichan - daqiannianzichan) / daqiannianzichan) * 100).toFixed(2)).res,
        sannianqian: ""
      };
      var fuzhaitongbihistory = {
        zhibiaomingchen: "负债同比",
        yinianqian: dataformat.execute((((qunianfuzhai - qiannianfuzhai) / qiannianfuzhai) * 100).toFixed(2)).res,
        liangnianqian: dataformat.execute((((qiannianfuzhai - daqiannianfuzhai) / daqiannianfuzhai) * 100).toFixed(2)).res,
        sannianqian: ""
      };
      historyInfoList.push(zichanhistory);
      historyInfoList.push(zichantongbihistory);
      historyInfoList.push(fuzhaihistory);
      historyInfoList.push(fuzhaitongbihistory);
      var rateofpay = getRateOfPay.execute(param1);
      var zongzichanbaochoulv = {
        zhibiaomingchen: "总资产报酬率",
        benqizhi: rateofpay.res.RateOfPay,
        tongbizengchang: dataformat.execute((((rateofpay.res.RateOfPay - rateofpay.res.yeartoyear) / rateofpay.res.yeartoyear) * 100).toFixed(2)).res,
        huanbizengchang: dataformat.execute((((rateofpay.res.RateOfPay - rateofpay.res.monthtomonth) / rateofpay.res.monthtomonth) * 100).toFixed(2)).res,
        nianleijizhi: "0",
        yewujianyi: "0"
      };
      var liudongbilv = {
        zhibiaomingchen: "流动比率",
        benqizhi: "0",
        tongbizengchang: "0",
        huanbizengchang: "0",
        nianleijizhi: "0",
        yewujianyi: "0"
      };
      var quickratio = getQuickRatio.execute(param1);
      var lastyearquickratio = getQuickRatio.execute(param2);
      var lastmonthquickratio = getQuickRatio.execute(param3);
      var sudongbilv = {
        zhibiaomingchen: "速动比率",
        benqizhi: quickratio.sdbilv.sdvl,
        tongbizengchang: dataformat.execute((((quickratio.sdbilv.sdvl - lastyearquickratio.sdbilv.sdvl) / lastyearquickratio.sdbilv.sdvl) * 100).toFixed(2)).res,
        huanbizengchang: dataformat.execute((((quickratio.sdbilv.sdvl - lastmonthquickratio.sdbilv.sdvl) / lastmonthquickratio.sdbilv.sdvl) * 100).toFixed(2)).res,
        nianleijizhi: quickratio.sdbilv.nlj,
        yewujianyi: "0"
      };
      var yieldrate = getYieldRate.execute(param1);
      var zongzichanshouyilv = {
        zhibiaomingchen: "总资产收益率",
        benqizhi: yieldrate.res.yieldrate,
        tongbizengchang: dataformat.execute((((yieldrate.res.yieldrate - yieldrate.res.yearonyear) / yieldrate.res.yearonyear) * 100).toFixed(2)).res,
        huanbizengchang: dataformat.execute((((yieldrate.res.yieldrate - yieldrate.res.monthonmonth) / yieldrate.res.monthonmonth) * 100).toFixed(2)).res,
        nianleijizhi: "0",
        yewujianyi: "0"
      };
      extendedInfoList.push(zongzichanbaochoulv);
      extendedInfoList.push(sudongbilv);
      extendedInfoList.push(zongzichanshouyilv);
      var zichanfuzhai = [
        {
          name: "资产负债信息",
          historyInfoList: historyInfoList,
          managementAdviceList: managementAdviceList,
          baseInfoList: baseInfoList,
          extendedInfoList: extendedInfoList,
          detailsInfoList: detailsInfoList
        }
      ];
      ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.financialanalysisdetails", zichanfuzhai, "yb3cfbba9b");
      return { zichanfuzhai };
    } catch (e) {
      throw new Error(e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });