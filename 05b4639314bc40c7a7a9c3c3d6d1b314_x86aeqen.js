let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询申请单
    var billId = param.variablesMap.id;
    var sql = `select * from AT17EE80A016F80009.AT17EE80A016F80009.BZSCSCSQD WHERE id= ` + billId;
    var res = ObjectStore.queryByYonQL(sql);
    var cpx = res[0].cPX;
    var cpgs = res[0].cPGS;
    var cpgg = res[0].cPGG;
    var chanpin = res[0].cHANPIN;
    //查询规则表
    var gzsql = `select * from AT17EE80A016F80009.AT17EE80A016F80009.BZSCGLGZK `;
    var gzres = ObjectStore.queryByYonQL(gzsql);
    gzres = gzres.filter((item) => {
      return item.cHANPIN == cpx;
    });
    var id = gzres[0].id;
    //获取符合条件的子表信息
    var gzhsql = `select * from AT17EE80A016F80009.AT17EE80A016F80009.BZSCGLGZKZB `;
    var gzhres = ObjectStore.queryByYonQL(gzhsql);
    gzhres = gzhres.filter((item) => {
      return item.BZSCGLGZK_id == id && item.cHANPIN == chanpin && item.cPGG == cpgg && item.cPGS == cpgs;
    });
    var wendang = gzhres[0].wendang;
    var zongjingli = gzhres[0].zongjingli;
    var staffNew = gzhres[0].staffNew;
    var chanpinzongjian = gzhres[0].chanpinzongjian;
    var onlyManager;
    if (chanpinzongjian == zongjingli) {
      onlyManager = 1;
    }
    return {
      bindType: "multiVar",
      variables: {
        A0001: { dataType: "staff", data: staffNew },
        A0002: { dataType: "staff", data: chanpinzongjian },
        A0003: { dataType: "staff", data: zongjingli },
        A0004: { dataType: "staff", data: wendang },
        A0005: onlyManager
      }
    };
  }
}
exports({ entryPoint: MyTrigger });