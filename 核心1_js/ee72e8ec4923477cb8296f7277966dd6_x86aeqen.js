let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var billId = param.variablesMap.id;
    var sql = `select * from AT17FE7F8616F80008.AT17FE7F8616F80008.LCZX  where LCYZ_BGSQ_id = ` + billId;
    var res = ObjectStore.queryByYonQL(sql);
    var param21 = { ziduan: "业务信息===" + JSON.stringify(res) };
    ObjectStore.insert("AT17FE7F8616F80008.AT17FE7F8616F80008.YWRZS", param21, "YWRZSList");
    var CYRBL00 = "";
    var CYRBL01 = "";
    var CYRBL02 = "";
    var CYRBL03 = "";
    debugger;
    for (var i = res.length - 1; i >= 0; i--) {
      //可以根据规则抽象一下逻辑
      var param21 = { ziduan: "业务信息===" + JSON.stringify(res[i]) };
      ObjectStore.insert("AT17FE7F8616F80008.AT17FE7F8616F80008.YWRZS", param21, "YWRZSList");
      if (res[i].huanjiebianma == "GZ001A01") {
        CYRBL00 = res[i].canyuren;
      }
      if (res[i].huanjiebianma == "GZ001A02") {
        CYRBL01 = res[i].canyuren;
      }
      if (res[i].huanjiebianma == "GZ001A03") {
        CYRBL02 = res[i].canyuren;
      }
      if (res[i].huanjiebianma == "GZ001A04") {
        CYRBL03 = res[i].canyuren;
      }
    }
    var param21 = {
      ziduan:
        "业务信息===" +
        JSON.stringify({
          bindType: "multiVar",
          variables: {
            CYRBL00: { dataType: "staff", data: CYRBL00 },
            CYRBL01: { dataType: "staff", data: CYRBL01 },
            CYRBL02: { dataType: "staff", data: CYRBL02 },
            CYRBL03: { dataType: "staff", data: CYRBL03 }
          }
        })
    };
    ObjectStore.insert("AT17FE7F8616F80008.AT17FE7F8616F80008.YWRZS", param21, "YWRZSList");
    return {
      bindType: "multiVar",
      variables: {
        CYRBL00: CYRBL00,
        CYRBL01: CYRBL01,
        CYRBL02: CYRBL02,
        CYRBL03: CYRBL03
      }
    };
  }
}
exports({ entryPoint: MyTrigger });