let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    for (var i = request.gsmcs.length - 1; i >= 0; i--) {
      let sql = "select id,jifen from GT56481AT32.GT56481AT32.QYK  where gongsimingchen='" + request.gsmcs[i] + "' ";
      let res = ObjectStore.queryByYonQL(sql);
      let qykid; //企业库ID
      let csjf; //初始积分
      if (res.length > 0) {
        qykid = res[0].id;
        if (res[0].jifen == undefined || res[0].jifen == "") {
          csjf = 0;
        } else {
          csjf = res[0].jifen;
        }
      } else {
        return {};
      }
      let jflj; //积分累计
      let jfxh; //积分消耗
      let jfsy; //积分剩余
      let jfljzh; //积分累计+初始化
      let tyhtsql = "select sum(bencihuodejifen),sum(jifen) from GT56762AT44.GT56762AT44.QTshoukuan where gongsimingchen='" + qykid + "'  and code not in('" + request.docdate + "') "; //  通用合同收款
      let tyhtres = ObjectStore.queryByYonQL(tyhtsql);
      let tyhtcihd = 0; //积分合同(通用合同收款)
      let tyhtbcxh = 0; //积分消耗总数(通用合同收款)
      if (tyhtres.length > 0) {
        if (tyhtres[0].bencihuodejifen != undefined && tyhtres[0].bencihuodejifen != "") {
          tyhtcihd = tyhtres[0].bencihuodejifen; //积分合同(不含本单)
        }
        if (tyhtres[0].jifen != undefined && tyhtres[0].jifen != "") {
          tyhtbcxh = tyhtres[0].jifen; //积分消耗总数(不含本单)
        }
      }
      let zzhtsql = "select sum(bencihuodejifen),sum(jifen) from GT57700AT57.GT57700AT57.QTZZSK where qiyemingchen='" + request.gsmcs[i] + "'"; //  资质合同收款
      let zzhtres = ObjectStore.queryByYonQL(zzhtsql);
      let zzhtcihd = 0; //积分合同(资质合同收款)
      let zzhtbcxh = 0; //积分消耗总数(资质合同收款)
      if (zzhtres.length > 0) {
        if (zzhtres[0].bencihuodejifen != undefined && zzhtres[0].bencihuodejifen != "") {
          zzhtcihd = zzhtres[0].bencihuodejifen; //积分合同
        }
        if (zzhtres[0].jifen != undefined && zzhtres[0].jifen != "") {
          zzhtbcxh = zzhtres[0].jifen; //积分消耗总数
        }
      }
      let tyfksql = "select sum(jifen) from GT57020AT46.GT57020AT46.QTFK where gongsimingchen='" + qykid + "'"; //  晴天通用合同付款
      let tyfkres = ObjectStore.queryByYonQL(tyfksql);
      let tyfkbcxh = 0; //积分消耗总数(晴天通用合同付款)
      if (tyfkres.length > 0) {
        if (tyfkres[0].jifen != undefined && tyfkres[0].jifen != "") {
          tyfkbcxh = tyfkres[0].jifen; //积分消耗总数
        }
      }
      let zztksql = "select sum(jifen) from GT57293AT50.GT57293AT50.AQTZZTK where gongsimingchen='" + qykid + "'"; //晴天资质退款
      let zztkres = ObjectStore.queryByYonQL(zztksql);
      let zztkbcxh = 0; //积分消耗总数(晴天资质退款)
      if (zztkres.length > 0) {
        if (zztkres[0].jifen != undefined && zztkres[0].jifen != "") {
          zztkbcxh = zztkres[0].jifen; //积分消耗总数
        }
      }
      let htgdsql = "select sum(bencixiaofeijifen) from GT57529AT55.GT57529AT55.FWSP where qiyemingchen='" + qykid + "'"; //合同工单（服务审批）
      let htgdres = ObjectStore.queryByYonQL(htgdsql);
      let htgdbcxh = 0; //积分消耗总数(合同工单（服务审批）)
      if (htgdres.length > 0) {
        if (htgdres[0].bencixiaofeijifen != undefined && htgdres[0].bencixiaofeijifen != "") {
          htgdbcxh = htgdres[0].bencixiaofeijifen; //积分消耗总数
        }
      }
      jflj = (Number(tyhtcihd) + Number(zzhtcihd)).toFixed(2); //积分累计
      jfljzh = (Number(csjf) + Number(tyhtcihd) + Number(zzhtcihd)).toFixed(2); //积分累计+初始化
      jfxh = (Number(tyhtbcxh) + Number(zzhtbcxh) + Number(tyfkbcxh) + Number(zztkbcxh) + Number(htgdbcxh)).toFixed(2); //积分消耗
      jfsy = (Number(jfljzh) - Number(jfxh)).toFixed(2); //积分剩余
      let object = {
        id: qykid,
        jifenhetong: jflj,
        leijijifenzongshu: jfljzh,
        jifenxiaohaozongshu: jfxh,
        jifenshengyuzongshu: jfsy
      };
      let ress = ObjectStore.updateById("GT56481AT32.GT56481AT32.QYK", object, "cc42b0d2List");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });