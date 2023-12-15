let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      // 记录入参的开始和结束期间
      var startPeriod = request.period1;
      var endPeriod = request.period2;
      var urlNow = ObjectStore.env().url;
      let url = urlNow + "/iuap-api-gateway/yonbip/fi/ficloud/cashflowdetail/queryapi";
      //年累计值(本年)
      let body = {
        accbook: request.accbook,
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
      body = {
        accbook: request.accbook,
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
      body = {
        accbook: request.accbook,
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
      body = {
        accbook: request.accbook,
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
      body = {
        accbook: request.accbook,
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
      body = {
        accbook: request.accbook,
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
      body = {
        accbook: request.accbook,
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
      body = {
        accbook: request.accbook,
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
      let result = {
        nianleiji: nianleiji,
        benqizhi: benqizhi,
        huanbi: huanbi,
        tongbi: tongbi,
        yijiu: yijiu,
        erling: erling,
        eryi: eryi,
        erer: erer
      };
      return { result };
    } catch (e) {
      throw new Error("执行脚本getCash报错：" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });