let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取单据数据
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
    gzres = gzres.map((item) => {
      if (item.cHANPIN == cpx) return item;
    });
    var id = gzres[0].id;
    //获取符合条件的子表信息
    var gzhsql = `select * from AT17EE80A016F80009.AT17EE80A016F80009.BZSCGLGZKZB `;
    var gzhres = ObjectStore.queryByYonQL(gzhsql);
    return 1;
  }
}
exports({ entryPoint: MyTrigger });