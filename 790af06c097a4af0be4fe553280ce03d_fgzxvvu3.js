let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 数据库清空
    var object = { danjubiaoshi: "3" };
    var res = ObjectStore.deleteByMap("AT176A3EE417500003.AT176A3EE417500003.Bankjournal", object, "BankjournalNewList");
    // 付款单
    let sqlInfk = "SELECT id,code,financeOrg,dept,staff,freeChId from earap.payment.PaymentHeader"; //付款单
    let resInfk = ObjectStore.queryByYonQL(sqlInfk, "yonbip-fi-earapbill");
    for (var d = 0; d < resInfk.length; d++) {
      let code = resInfk[d].code; //单据编号
      let gongsi = resInfk[d].financeOrg; //付款组织
      let bumen = resInfk[d].dept; //部门
      let jingbanren = resInfk[d].staff; //业务员
      if (resInfk[d].freeChId !== undefined) {
        if (resInfk[d].freeChId.A1109 !== undefined) {
          var piaodaoqiri2 = resInfk[d].freeChId.A1109; //票到日期号
        } else {
          var piaodaoqiri2 = null; //票到日期号
        }
      } else {
        var piaodaoqiri2 = null;
      }
      let sqlInfk2 = "SELECT relatedsettlementbillno from stwb.datasettled.DataSettled where businessbillnum ='" + code + "'"; //待结算数据
      let resInfk2 = ObjectStore.queryByYonQL(sqlInfk2, "stwb");
      if (resInfk2.length == 0) {
        var riqi2 = null;
      } else {
        let relatedsettlementbillno = resInfk2[0].relatedsettlementbillno;
        let sqlInfk3 = "SELECT vouchdate from stwb.settlebench.SettleBench where code ='" + relatedsettlementbillno + "'"; //结算工作台
        let resInfk3 = ObjectStore.queryByYonQL(sqlInfk3, "stwb");
        if (resInfk3.length == 0) {
          var riqi2 = null;
        } else {
          var riqi2 = resInfk3[0].vouchdate; //结算日期
          var riqi2 = riqi2.substring(0, 10);
        }
      }
      if (riqi2) {
        let danjuid = resInfk[d].id; //单据id
        let sqlInfk4 = "SELECT id,oriTaxIncludedAmount,enterpriseBankAccount,noteNo from earap.payment.PaymentBody where headerId = '" + danjuid + "'"; //付款单子表
        let resInfk4 = ObjectStore.queryByYonQL(sqlInfk4, "yonbip-fi-earapbill");
        for (var e = 0; e < resInfk4.length; e++) {
          let danjuid2 = resInfk4[e].id;
          let zhichu = resInfk4[e].oriTaxIncludedAmount; //付款金额 支出
          let yinxing = resInfk4[e].enterpriseBankAccount; //银行
          let huipiaohao = resInfk4[e].noteNo; //票据号
          let danjubiaoshi = 3; //单据标识
          let object = {
            danjuid: danjuid2,
            gongsi: gongsi,
            danjubianhao: code,
            zhichu: zhichu,
            bumen: bumen,
            jingbanren: jingbanren,
            piaodaoqiri: piaodaoqiri2,
            yinxing: yinxing,
            huipiaohao: huipiaohao,
            riqi: riqi2,
            danjubiaoshi: danjubiaoshi
          };
          let resInfk5 = ObjectStore.insert("AT176A3EE417500003.AT176A3EE417500003.Bankjournal", object, "BankjournalNewList");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });