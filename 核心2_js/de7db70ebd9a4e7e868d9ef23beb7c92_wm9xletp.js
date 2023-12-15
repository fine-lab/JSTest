let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    for (var i = request.gsmcs.length - 1; i >= 0; i--) {
      let sql = "select id,ziduan2 from GT87848AT43.GT87848AT43.QYK  where gongsimingchen='" + request.gsmcs[i] + "' ";
      let res = ObjectStore.queryByYonQL(sql);
      let qykid; //企业库ID
      let csjf; //初始积分
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
      let jflj; //积分累计
      let jfxh; //积分消耗
      let jfsy; //积分剩余
      let jfljzh; //积分累计+初始化
      let tyhtsql =
        "select sum(bencihuodejifen),sum(bencixiaohaojifen) from GT87848AT43.GT87848AT43.ceshishiti where gongsimingchen='" + request.gsmcs[i] + "' and code not in ('" + request.docdate + "') "; //  通用合同收款
      let tyhtres = ObjectStore.queryByYonQL(tyhtsql);
      let tyhtcihd = 0; //积分合同(通用合同收款)
      let tyhtbcxh = 0; //积分消耗总数(通用合同收款)
      if (tyhtres.length > 0) {
        tyhtcihd = tyhtres[0].bencihuodejifen; //积分合同(不含本单)
        tyhtbcxh = tyhtres[0].bencixiaohaojifen; //积分消耗总数(不含本单)
      }
      jflj = Number(tyhtcihd) + Number(csjf); //积分累计
      jfxh = Number(tyhtbcxh); //积分消耗
      jfsy = Number(jflj) - Number(jfxh); //积分剩余
      let object = {
        id: res[0].id,
        jifenhetong: tyhtcihd,
        ziduan6: jflj,
        ziduan8: jfxh,
        jifenshengyuzongshu: jfsy
      };
      ObjectStore.updateById("GT87848AT43.GT87848AT43.QYK", object, "67ad119eList");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });