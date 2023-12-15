let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询申请单
    var billId = param.variablesMap.id;
    var sql = `select * from AT17F6E30216F80002.AT17F6E30216F80002.BZZB  `;
    var res = ObjectStore.queryByYonQL(sql);
    var BL1 = 0;
    var BL5;
    for (var i = res.length - 1; i >= 0; i--) {
      if (res[i].huodongjiedian == "活动1") {
        BL1 = res[i].shifuzhixing;
        BL5 = res[i].zhixingren;
      }
    }
    var param21 = {
      ziduan1:
        "业务信息===" +
        JSON.stringify({
          bindType: "multiVar",
          variables: {
            BL1: BL1,
            BL5: { dataType: "staff", data: BL5 }
          }
        })
    };
    ObjectStore.insert("AT17F6E30216F80002.AT17F6E30216F80002.YWRZ1111", param21, "YWRZ1111List");
    return {
      bindType: "multiVar",
      variables: {
        BL1: BL1,
        BL5: { dataType: "staff", data: BL5 }
      }
    };
  }
}
exports({ entryPoint: MyTrigger });