let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, num1, operator, num2) {
    var urlNow = ObjectStore.env().url;
    try {
      let url = urlNow + "/iuap-api-gateway/yonbip/fi/ficloud/api/querySubjectBalance";
      let body = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        codes: context.codes, //会计科目 数组结构
        period1: context.period1, //起始期间,必填
        period2: context.period2, //结束期间,必填
        currency: "",
        tally: 0,
        tempvoucher: 0
      };
      let apiResponse = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      var res1 = JSON.parse(apiResponse);
      let funcPreviousPeriodDate = extrequire("AT17AF88F609C00004.common.getMonthOnMonth");
      var lastMonth = funcPreviousPeriodDate.execute(context.period2).date;
      let lastMonthBody = {
        org: context.org, //会计主体ID,必填
        accbook: context.accbook, // 账簿
        codes: context.codes, //会计科目 数组结构
        period1: lastMonth, //起始期间,必填
        period2: lastMonth, //结束期间,必填
        currency: "",
        tally: 0,
        tempvoucher: 0
      };
      let apiResponse1 = openLinker("POST", url, "AT17AF88F609C00004", JSON.stringify(lastMonthBody)); //TODO：注意填写应用编码(请看注意事项)
      var res2 = JSON.parse(apiResponse1);
      //做加减乘除用的公共方法
      let calculate = extrequire("AT17AF88F609C00004.common.calculate");
      var subList = [];
      var subMap = new Map();
      res1.data.forEach((item) => {
        subMap.set(item.accsubject_code, item);
      });
      var lastMonthSubMap = new Map();
      res2.data.forEach((item) => {
        lastMonthSubMap.set(item.accsubject_code, item);
      });
      //数据整理成需要的格式  TODO直接计算出结果
      context.codes.forEach((item) => {
        var sub = subMap.get(item);
        if (sub != null) {
          if (!sub.hasOwnProperty(num1)) {
            sub[num1] = 0;
          }
          if (!sub.hasOwnProperty(num2)) {
            sub[num2] = 0;
          }
          //本期值
          var thisIssueValue = calculate.execute(sub[num1], sub[num2], operator).result;
          var lastMonthSub = lastMonthSubMap.get(item);
          var lastIssueValue = 0;
          if (lastMonthSub != null) {
            if (!lastMonthSub.hasOwnProperty(num1)) {
              lastMonthSub[num1] = 0;
            }
            if (!lastMonthSub.hasOwnProperty(num2)) {
              lastMonthSub[num2] = 0;
            }
            //上期值
            lastIssueValue = calculate.execute(lastMonthSub[num1], lastMonthSub[num2], operator).result;
          }
          var childs = [];
          var lastMonthChilds = [];
          //本期最大值
          var thisIssueMax = {};
          var thisIssueMaxValue = 0;
          subMap.forEach((value, key) => {
            if (includes(key, item) && key.length > item.length) {
              if (value != null) {
                if (!value.hasOwnProperty(num1)) {
                  value[num1] = 0;
                }
                if (!value.hasOwnProperty(num2)) {
                  value[num2] = 0;
                }
                if (thisIssueMaxValue < calculate.execute(value[num1], value[num2], operator).result) {
                  thisIssueMaxValue = calculate.execute(value[num1], value[num2], operator).result;
                  thisIssueMax = value;
                }
              }
              childs.push(value);
            }
          });
          var monthOnMonthThisIssueMax = lastMonthSubMap.get(thisIssueMax.accsubject_code);
          var monthOnMonthThisIssueMaxValue = 0;
          if (monthOnMonthThisIssueMax != null) {
            monthOnMonthThisIssueMaxValue = calculate.execute(monthOnMonthThisIssueMax[num1], monthOnMonthThisIssueMax[num2], operator).result;
          }
          //上期最大值
          var lastIssueMax = {};
          var lastIssueMaxValue = 0;
          lastMonthSubMap.forEach((value, key) => {
            if (includes(key, item) && key.length > item.length) {
              if (value != null) {
                if (!value.hasOwnProperty(num1)) {
                  value[num1] = 0;
                }
                if (!value.hasOwnProperty(num2)) {
                  value[num2] = 0;
                }
                var lastMonthChild = value;
                if (lastIssueMaxValue < calculate.execute(value[num1], value[num2], operator).result) {
                  lastIssueMaxValue = calculate.execute(value[num1], value[num2], operator).result;
                  lastIssueMax = value;
                }
                lastMonthChilds.push(lastMonthChild);
              }
            }
          });
          sub.childs = childs;
          sub.lastMonthChilds = lastMonthChilds;
          sub.lastMonthSub = lastMonthSub;
          sub.thisIssueMax = thisIssueMax;
          sub.lastIssueMax = lastIssueMax;
          sub.thisIssueValue = thisIssueValue == null ? 0 : thisIssueValue;
          sub.lastIssueValue = lastIssueValue;
          sub.thisIssueMaxValue = thisIssueMaxValue;
          sub.lastIssueMaxValue = lastIssueMaxValue;
          sub.monthOnMonthThisIssueMax = monthOnMonthThisIssueMax;
          sub.monthOnMonthThisIssueMaxValue = monthOnMonthThisIssueMaxValue;
          subList.push(sub);
        }
      });
      return { subList };
    } catch (e) {
      throw new Error(e);
    }
  }
}
exports({ entryPoint: MyTrigger });