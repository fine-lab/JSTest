let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    var param1 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: context.period1, //起始期间,必填
      period2: context.period2, //结束期间,必填
      codes: [
        "1122",
        "1012",
        "1101",
        "1121",
        "1123",
        "1221",
        "1531",
        "1511",
        "1521",
        "1601",
        "1604",
        "1701",
        "1801",
        "1811",
        "2001",
        "2201",
        "2202",
        "2203",
        "2211",
        "2231",
        "2232",
        "2241",
        "2501",
        "2701"
      ]
    };
    let func = extrequire("AT17AF88F609C00004.common.getSubjects");
    let res = func.execute(param1);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });