let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      var cash = 0;
      var fisrtCash = 0;
      var datas = param.data.data.list;
      var name = context.zhibiaomingcheng;
      datas.forEach((item) => {
        let cashflowitemcode = item.cashflowitemcode;
        if (name == "经营活动现金流入") {
          //流入
          if (cashflowitemcode.substring(0, 3) == "111") {
            cash = cash + item.amountorg;
          }
          if (cashflowitemcode.substring(0, 4) == "1111") {
            fisrtCash = fisrtCash + item.amountorg;
          }
          //投资性净现金流
        } else if (name == "经营活动现金流出") {
          //流出
          if (cashflowitemcode.substring(0, 3) == "112") {
            cash = cash + item.amountorg;
          }
          if (cashflowitemcode.substring(0, 4) == "1121") {
            fisrtCash = fisrtCash + item.amountorg;
          }
          //筹资性净现金流
        } else if (name == "投资活动现金流入") {
          //流入
          if (cashflowitemcode.substring(0, 3) == "121") {
            cash = cash + item.amountorg;
          }
          if (cashflowitemcode.substring(0, 4) == "1211") {
            fisrtCash = fisrtCash + item.amountorg;
          }
        } else if (name == "投资活动现金流出") {
          //流出
          if (cashflowitemcode.substring(0, 3) == "122") {
            cash = cash + item.amountorg;
          }
          if (cashflowitemcode.substring(0, 4) == "1221") {
            fisrtCash = fisrtCash + item.amountorg;
          }
        } else if (name == "筹资活动现金流入") {
          //流入
          if (cashflowitemcode.substring(0, 3) == "131") {
            cash = cash + item.amountorg;
          }
          if (cashflowitemcode.substring(0, 4) == "1311") {
            fisrtCash = fisrtCash + item.amountorg;
          }
        } else if (name == "筹资活动现金流出") {
          //流出
          if (cashflowitemcode.substring(0, 3) == "132") {
            cash = cash + item.amountorg;
          }
          if (cashflowitemcode.substring(0, 4) == "1321") {
            fisrtCash = fisrtCash + item.amountorg;
          }
        }
      });
      var result = {
        cash: cash,
        fisrtCash: fisrtCash
      };
      return { result };
    } catch (e) {
      throw new Error("执行脚getCash报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });