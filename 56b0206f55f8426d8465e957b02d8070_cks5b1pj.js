let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      // 记录入参的开始和结束期间
      var startPeriod = context.period1;
      var endPeriod = context.period2;
      var urlNow = ObjectStore.env().url;
      let url = urlNow + "/iuap-api-gateway/yonbip/fi/ficloud/cashflowdetail/queryapi";
      //年累计值(本年)
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
      var datas = JSON.parse(apiResponse);
      // 对接口返回编码进行判断 0失败  200正常返回
      let code = datas.code;
      if (code == 0) {
        return datas.message;
      }
      var cashIn = 0;
      var cashOut = 0;
      var zhibiaoList = ["经营性净现金流", "投资性净现金流", "筹资性净现金流"];
      // 返回
      var resultList = [];
      var result = {
        zhibiao: "",
        zhi: 0
      };
      zhibiaoList.forEach((name) => {
        //计算经营性净现金流
        cashIn = 0;
        cashOut = 0;
        if (name == "经营性净现金流") {
          datas.data.list.forEach((item) => {
            //流入
            let cashflowitemcode = item.cashflowitemcode;
            if (cashflowitemcode.substring(0, 3) == "111") {
              cashIn = cashIn + item.amountorg;
            }
            //流出
            if (cashflowitemcode.substring(0, 3) == "112") {
              cashOut = cashOut + item.amountorg;
            }
          });
          result = {
            zhibiao: name,
            zhi: cashIn - cashOut
          };
          resultList.push(result);
          //投资性净现金流
        } else if (name == "投资性净现金流") {
          datas.data.list.forEach((item) => {
            //流入
            let cashflowitemcode = item.cashflowitemcode;
            if (cashflowitemcode.substring(0, 3) == "121") {
              cashIn = cashIn + item.amountorg;
            }
            //流出
            if (cashflowitemcode.substring(0, 3) == "122") {
              cashOut = cashOut + item.amountorg;
            }
          });
          result = {
            zhibiao: name,
            zhi: cashIn - cashOut
          };
          resultList.push(result);
          //筹资性净现金流
        } else if (name == "筹资性净现金流") {
          datas.data.list.forEach((item) => {
            //流入
            let cashflowitemcode = item.cashflowitemcode;
            if (cashflowitemcode.substring(0, 3) == "131") {
              cashIn = cashIn + item.amountorg;
            }
            //流出
            if (cashflowitemcode.substring(0, 3) == "132") {
              cashOut = cashOut + item.amountorg;
            }
          });
          result = {
            zhibiao: name,
            zhi: cashIn - cashOut
          };
          resultList.push(result);
        }
      });
      return { resultList };
    } catch (e) {
      throw new Error("执行脚本getCash报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });