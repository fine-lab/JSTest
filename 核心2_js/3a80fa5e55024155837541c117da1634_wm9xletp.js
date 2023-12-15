let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sql = "select id,ziduan2 from GT87848AT43.GT87848AT43.QYK  where gongsimingchen='" + param.data[0].gongsimingchen + "' ";
    var res = ObjectStore.queryByYonQL(sql);
    var qykid; //企业库ID
    var csjf; //初始积分
    if (res.length > 0) {
      qykid = res[0].id;
      if (res[0].ziduan2 == undefined) {
        csjf = 0;
      } else {
        csjf = res[0].ziduan2;
      }
    } else {
      return {};
    }
    var jflj; //积分累计
    var jfxh; //积分消耗
    var jfsy; //积分剩余
    var tyhtsql =
      "select sum(bencihuodejifen),sum(bencixiaohaojifen) from GT87848AT43.GT87848AT43.ceshishiti where gongsimingchen='" + param.data[0].gongsimingchen + "' and code<>'" + param.data[0].code + "' "; //  通用合同收款
    var tyhtres = ObjectStore.queryByYonQL(tyhtsql);
    var tyhtcihd = 0; //积分合同(通用合同收款)
    var tyhtbcxh = 0; //积分消耗总数(通用合同收款)
    if (tyhtres.length > 0) {
      tyhtcihd = tyhtres[0].bencihuodejifen; //积分合同(不含本单)
      tyhtbcxh = tyhtres[0].bencixiaohaojifen; //积分消耗总数(不含本单)
    }
    jflj = Number(tyhtcihd) + Number(csjf); //积分累计
    jfxh = Number(tyhtbcxh); //积分消耗
    jfsy = Number(jflj) - Number(jfxh); //积分剩余
    var object = {
      id: res[0].id,
      jifenhetong: tyhtcihd,
      ziduan6: jflj,
      ziduan8: jfxh,
      jifenshengyuzongshu: jfsy
    };
    var ress = ObjectStore.updateById("GT87848AT43.GT87848AT43.QYK", object, "67ad119eList");
    return {};
  }
}
exports({ entryPoint: MyTrigger });