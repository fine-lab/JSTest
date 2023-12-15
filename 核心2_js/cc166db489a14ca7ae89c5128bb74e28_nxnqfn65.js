let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let customer = request.customer;
    let rule = request.rule;
    if (rule === "1") {
      let querySql_1 =
        "select " +
        "rgCustomer.name," +
        "sum(rpQuantity) rpQuantity ," +
        "sum(rgExQuantity) rgExQuantity," +
        "sum(rpAftQuantity) rpAftQuantity," +
        "sum(rpQuantity)-sum(ifnull(rgExQuantity,0)) balance " +
        "from GT4691AT1.GT4691AT1.MRebateAmountLog where " +
        "rgCustomer='" +
        customer +
        "' group by rgCustomer";
      let queryRes = ObjectStore.queryByYonQL(querySql_1, "developplatform");
      if (queryRes.length !== 0) {
        let balance = queryRes[0]["balance"];
        if (balance < 0) {
          return { message: "赠品金额池当前总金额是负数（" + balance + "） – 不能选任何赠品", balance: balance };
        }
        //打印出执行的SQL，生产环境可不打印
        return { message: "", balance: balance, querySql_1: querySql_1 };
      }
      return { message: "未查询到该经销商对应的金额池记录" };
    }
    if (rule === "2") {
      let msgs = [];
      let extobj = request.extobj;
      for (let i = 0; i < extobj.length; i++) {
        let querySql_1 =
          "select " +
          "rpBU," +
          "rgCustomer.name," +
          "sum(rpQuantity) rpQuantity ," +
          "sum(rgExQuantity) rgExQuantity," +
          "sum(rpAftQuantity) rpAftQuantity," +
          "sum(rpQuantity)-sum(ifnull(rgExQuantity,0)) balance " +
          "from GT4691AT1.GT4691AT1.MRebateAmountLog where " +
          "rgCustomer='" +
          customer +
          "' " +
          "and rpBU='" +
          extobj[i]["bu"] +
          "' " +
          "group by rgCustomer,rpBU";
        let queryRes = ObjectStore.queryByYonQL(querySql_1, "developplatform");
        if (queryRes.length !== 0) {
          let balance = queryRes[0]["balance"];
          let rebateMoney = extobj[i]["rebateMoney"];
          if (!(rebateMoney <= balance)) {
            let bu = extobj[i]["bu"];
            msgs.push({ message: "所选BU（" + bu + "）赠品总金额（" + rebateMoney + "）高于BU（" + bu + "）总剩余金额（" + balance + "） – 不能添加任何赠品;  ", balance: balance });
          }
        }
      }
      return { message: msgs };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });