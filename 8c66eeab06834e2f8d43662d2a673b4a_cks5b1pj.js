let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      var result = 0;
      var cash = 0;
      var datas = param.data.data.list;
      var name = context.zhibiaomingcheng;
      datas.forEach((item) => {
        let cashflowitemcode = item.cashflowitemcode;
        //流入
        if (cashflowitemcode.substring(0, 4) == "1111") {
          cash = cash + item.amountorg;
        }
      });
      result = cash;
      return { result };
    } catch (e) {
      throw new Error("执行脚getCash报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });