let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      var result = 0;
      var cashIn = 0;
      var cashOut = 0;
      var datas = param.data.data.list;
      var name = context.zhibiaomingcheng;
      datas.forEach((item) => {
        let cashflowitemcode = item.cashflowitemcode;
        //计算经营性净现金流
        //流入
        if (cashflowitemcode.substring(0, 3) == "111") {
          cashIn = cashIn + item.amountorg;
        }
        //流出
        if (cashflowitemcode.substring(0, 3) == "112") {
          cashOut = cashOut + item.amountorg;
        }
      });
      result = cashIn - cashOut;
      return { result };
    } catch (e) {
      throw new Error("执行脚本getCashForProfit报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });