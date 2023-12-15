let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var param1 = {
      org: context.org, //会计主体ID,必填
      accbook: context.accbook, // 账簿
      period1: context.period1, //起始期间,必填
      period2: context.period2, //结束期间,必填
      codes: [
        "1001",
        "1002",
        "1012",
        "1101",
        "1121",
        "1122",
        "1131",
        "1132",
        "1221",
        "1231",
        "1321",
        "1471",
        "1901",
        "2001",
        "2101",
        "2201",
        "2202",
        "2203",
        "2211",
        "2221",
        "2231",
        "2232",
        "2241",
        "2341",
        "2501"
      ]
    };
    let func = extrequire("AT17AF88F609C00004.common.getSubjects");
    let res = func.execute(param1);
    var sdzichanlist = ["1001", "1002", "1012", "1101", "1121", "1122", "1131", "1132", "1221", "1231", "1321", "1471", "1901"];
    var ldfuzhailist = ["2001", "2101", "2201", "2202", "2203", "2211", "2221", "2231", "2232", "2241", "2341", "2501"];
    var sdzichan = 0;
    var ldfuzhai = 0;
    var nianleiji = 0;
    res.forEach((item) => {
      if (item != null) {
        if (!item.hasOwnProperty("localdebit2")) {
          item.localdebit2 = 0;
        }
        if (!item.hasOwnProperty("localcredebit2")) {
          item.localcredebit2 = 0;
        }
        if (sdzichanlist.includes(item.accsubject_code)) {
          var zichan = item.localdebit2 - item.localcredebit2;
          sdzichan += zichan;
        }
        if (ldfuzhailist.includes(item.accsubject_code)) {
          var fuzhai = item.localcredebit2 - item.localdebit2;
          ldfuzhai += fuzhai;
        }
      }
      nianleiji += item.localdebit4;
    });
    var sdbilv = {
      sdvl: sdzichan / ldfuzhai,
      nlj: nianleiji
    };
    return { sdbilv };
  }
}
exports({ entryPoint: MyTrigger });