let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var billId = param.variablesMap.id;
    var sql = `select * from AT17FE7F8616F80008.AT17FE7F8616F80008.LCZX  where LCYZ_BGSQ_id = ` + billId;
    var res = ObjectStore.queryByYonQL(sql);
    var param21 = { ziduan: "业务信息===" + JSON.stringify(res) };
    ObjectStore.insert("AT17FE7F8616F80008.AT17FE7F8616F80008.YWRZS", param21, "YWRZSList");
    var FZBL1 = "否";
    var FZBL2 = "否";
    var FZBL3 = "否";
    var FZBL4 = "否";
    var HDCYR1;
    var HDCYR2;
    var HDCYR3;
    var HDCYR4;
    for (var i = res.length - 1; i >= 0; i--) {
      //可以根据规则抽象一下逻辑
      var param21 = { ziduan: "业务信息===" + JSON.stringify(res[i]) };
      ObjectStore.insert("AT17FE7F8616F80008.AT17FE7F8616F80008.YWRZS", param21, "YWRZSList");
      if (res[i].huanjiebianma == "GZ001A01") {
        if (!(res[i].zhixingyaoqiu == "1728967586777399296" && res[i].canyuren == null)) {
          FZBL1 = "是";
        }
        HDCYR1 = res[i].canyuren;
      }
      if (res[i].huanjiebianma == "GZ001A02") {
        if (!(res[i].zhixingyaoqiu == "1728967586777399296" && res[i].canyuren == null)) {
          FZBL2 = "是";
        }
        HDCYR2 = res[i].canyuren;
      }
      if (res[i].huanjiebianma == "GZ001A03") {
        if (!(res[i].zhixingyaoqiu == "1728967586777399296" && res[i].canyuren == null)) {
          FZBL3 = "是";
        }
        HDCYR3 = res[i].canyuren;
      }
      if (res[i].huanjiebianma == "GZ001A04") {
        if (!(res[i].zhixingyaoqiu == "1728967586777399296" && res[i].canyuren == null)) {
          FZBL4 = "是";
        }
        HDCYR4 = res[i].canyuren;
      }
    }
    var param21 = {
      ziduan:
        "业务信息===" +
        JSON.stringify({
          bindType: "multiVar",
          variables: {
            HDCYR1: { dataType: "staff", data: HDCYR1 },
            HDCYR2: { dataType: "staff", data: HDCYR2 },
            HDCYR3: { dataType: "staff", data: HDCYR3 },
            HDCYR4: { dataType: "staff", data: HDCYR4 },
            FZBL1: FZBL1,
            FZBL2: FZBL2,
            FZBL3: FZBL3,
            FZBL4: FZBL4
          }
        })
    };
    ObjectStore.insert("AT17FE7F8616F80008.AT17FE7F8616F80008.YWRZS", param21, "YWRZSList");
    return {
      bindType: "multiVar",
      variables: {
        HDCYR1: HDCYR1,
        HDCYR2: HDCYR2,
        HDCYR3: HDCYR3,
        HDCYR4: HDCYR4,
        FZBL1: FZBL1,
        FZBL2: FZBL2,
        FZBL3: FZBL3,
        FZBL4: FZBL4
      }
    };
  }
}
exports({ entryPoint: MyTrigger });