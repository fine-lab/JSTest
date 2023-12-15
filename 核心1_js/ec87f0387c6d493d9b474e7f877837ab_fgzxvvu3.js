let AbstractAPIHandler = require("AbstractAPIHandler");
let queryUtils = extrequire("PU.frontDefaultGroup.CommonUtilsQuery");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 数据库清空
    //获取当前北京时间//获取当前时间
    var nowDate = new Date().getTime();
    var date = new Date(nowDate + 8 * 3600 * 1000);
    //年
    var year = date.getFullYear();
    //月
    var month = date.getMonth();
    //日
    var day = date.getDate();
    var strDate = year + "-" + (month + 1 < 10 ? "0" + (month + 1) : month + 1) + "-" + (day < 10 ? "0" + day : day);
    //拼接1天后时间字符串
    var nowTime = date.getTime();
    //获取当前时间
    var date1 = new Date(nowTime - 24 * 3600 * 1000);
    //年
    var year1 = date1.getFullYear();
    //月
    var month1 = date1.getMonth();
    //日
    var day1 = date1.getDate();
    var strDate1 = year1 + "-" + (month1 + 1 < 10 ? "0" + (month1 + 1) : month1 + 1) + "-" + (day1 < 10 ? "0" + day1 : day1);
    //结算工作台
    let sqlInjs = "SELECT id,vouchdate,accentity from stwb.settlebench.SettleBench where vouchdate is not null and vouchdate >= '" + strDate1 + "' and vouchdate < '" + strDate + "'"; //结算工作台
    let resInjs = ObjectStore.queryByYonQL(sqlInjs, "stwb");
    let arr = [];
    for (var i = 0; i < resInjs.length; i++) {
      let gongsi = resInjs[i].accentity; //公司
      var riqi = resInjs[i].vouchdate; //结算日期
      let danjuid = resInjs[i].id; //单据id
      let sqlInjsb =
        "SELECT id,bizbillno,ourbankaccount,natAmt,receipttypeb,bizbilltype from stwb.settlebench.SettleBench_b where mainid = '" +
        danjuid +
        "' and bizbillno is not null and (bizbilltype = '14' or bizbilltype = '2' or bizbilltype = '10' or bizbilltype = '7' or bizbilltype = '25' or bizbilltype = '26' or bizbilltype = '27' or bizbilltype = '28' or bizbilltype = '11' or bizbilltype = '12' or bizbilltype = '13' or bizbilltype = '3') "; //结算工作台
      let resInjsb = ObjectStore.queryByYonQL(sqlInjsb, "stwb");
      for (var j = 0; j < resInjsb.length; j++) {
        let danjuid2 = resInjsb[j].id;
        let code = resInjsb[j].bizbillno; //单据编号
        let receipttypeb = resInjsb[j].receipttypeb; //收付类型
        let yinxing = resInjsb[j].ourbankaccount; //银行
        let bizbilltype = resInjsb[j].bizbilltype; //单据类型
        if (receipttypeb == 1) {
          var shouru = resInjsb[j].natAmt;
          var zhichu = 0;
        } else {
          var shouru = 0;
          var zhichu = resInjsb[j].natAmt;
        }
        let danjubiaoshi = 2; //单据标识
        let object = { danjuid: danjuid2, gongsi: gongsi, danjubianhao: code, zhichu: zhichu, shouru: shouru, yinxing: yinxing, riqi: riqi.substring(0, 10), danjubiaoshi: danjubiaoshi };
        //取 票到日期 汇票号 (资金收款单、资金付款单、收款单、付款单)， 经办人(除个人借款单、通用报销单、差旅费报销单、还款单外，其中退款单和对公预付款暂时取不到)
        if (bizbilltype == 14) {
          //个人借款单 znbzbx.personalloanbill.PersonalLoanBillVO  znbzbx  14
        } else if (bizbilltype == 2) {
          //通用报销单 znbzbx.expensebill.ExpenseBillVO  znbzbx  2
        } else if (bizbilltype == 10) {
          //付款单 earap.payment.PaymentHeader  yonbip-fi-earapbill  10
          let sqlInfk = "SELECT id,staff,freeChId from earap.payment.PaymentHeader where code = '" + code + "'"; //付款单
          let resInfk = ObjectStore.queryByYonQL(sqlInfk, "yonbip-fi-earapbill");
          for (var d = 0; d < resInfk.length; d++) {
            object.jingbanren = resInfk[d].staff; //业务员
            if (resInfk[d].freeChId !== undefined) {
              if (resInfk[d].freeChId.A1109 !== undefined) {
                object.piaodaoqiri = resInfk[d].freeChId.A1109; //票到日期号
              } else {
                object.piaodaoqiri = null; //票到日期号
              }
            } else {
              object.piaodaoqiri = null;
            }
            let danjuid = resInfk[d].id; //单据id
            let sqlInfk4 = "SELECT noteNo from earap.payment.PaymentBody where headerId = '" + danjuid + "'"; //付款单子表
            let resInfk4 = ObjectStore.queryByYonQL(sqlInfk4, "yonbip-fi-earapbill");
            for (var e = 0; e < resInfk4.length; e++) {
              object.huipiaohao = resInfk4[e].noteNo; //票据号
            }
          }
        } else if (bizbilltype == 7) {
          //收款单 earap.collection.CollectionHeader  yonbip-fi-earapbill  7
          let sqlInsk = "SELECT id,staff,freeChId from earap.collection.CollectionHeader where code = '" + code + "'"; //收款单
          let resInsk = ObjectStore.queryByYonQL(sqlInsk, "yonbip-fi-earapbill");
          for (var d = 0; d < resInsk.length; d++) {
            object.jingbanren = resInsk[d].staff; //业务员
            if (resInsk[d].freeChId !== undefined) {
              if (resInsk[d].freeChId.A1109 !== undefined) {
                object.piaodaoqiri = resInsk[d].freeChId.A1109; //票到日期号
              } else {
                object.piaodaoqiri = null; //票到日期号
              }
            } else {
              object.piaodaoqiri = null;
            }
            let danjuid = resInsk[d].id; //单据id
            let sqlInsk4 = "SELECT noteNo from earap.collection.CollectionBody where headerId = '" + danjuid + "'"; //收款单子表
            let resInsk4 = ObjectStore.queryByYonQL(sqlInsk4, "yonbip-fi-earapbill");
            for (var e = 0; e < resInsk4.length; e++) {
              object.huipiaohao = resInsk4[e].noteNo; //票据号
            }
          }
        } else if (bizbilltype == 25) {
          //资金收款单 cmp.fundcollection.FundCollection  ctm-cmp  25
          let sqlInzjsk = "SELECT id,operator,characterDef from cmp.fundcollection.FundCollection where code = '" + code + "'"; //资金收款单
          let resInzjsk = ObjectStore.queryByYonQL(sqlInzjsk, "ctm-cmp");
          for (var b = 0; b < resInzjsk.length; b++) {
            object.jingbanren = resInzjsk[b].operator; //经办人
            if (resInzjsk[b].characterDef !== undefined) {
              if (resInzjsk[b].characterDef.A1109 !== undefined) {
                object.piaodaoqiri = resInzjsk[b].characterDef.A1109; //票到日期号
              } else {
                object.piaodaoqiri = null; //票到日期号
              }
            } else {
              object.piaodaoqiri = null;
            }
            let danjuid = resInzjsk[b].id; //单据id
            let sqlInzjsk4 = "SELECT noteno from cmp.fundcollection.FundCollection_b where mainid = '" + danjuid + "'"; //资金收款单子表
            let resInzjsk4 = ObjectStore.queryByYonQL(sqlInzjsk4, "ctm-cmp");
            for (let c = 0; c < resInzjsk4.length; c++) {
              object.huipiaohao = resInzjsk4[c].noteno; // 汇票号
            }
          }
        } else if (bizbilltype == 26) {
          //资金付款单 cmp.fundpayment.FundPayment  ctm-cmp  26
          let sqlInzj = "SELECT id,operator,characterDef from cmp.fundpayment.FundPayment where code = '" + code + "'"; //资金付款单
          let resInzj = ObjectStore.queryByYonQL(sqlInzj, "ctm-cmp");
          for (var b = 0; b < resInzj.length; b++) {
            object.jingbanren = resInzj[b].operator; //经办人
            if (resInzj[b].characterDef !== undefined) {
              if (resInzj[b].characterDef.A1109 !== undefined) {
                object.piaodaoqiri = resInzj[b].characterDef.A1109; //票到日期号
              } else {
                object.piaodaoqiri = null; //票到日期号
              }
            } else {
              object.piaodaoqiri = null;
            }
            let danjuid = resInzj[b].id; //单据id
            let sqlInzj4 = "SELECT noteno from cmp.fundpayment.FundPayment_b where mainid = '" + danjuid + "'"; //资金付款单子表
            let resInzj4 = ObjectStore.queryByYonQL(sqlInzj4, "ctm-cmp");
            for (let c = 0; c < resInzj4.length; c++) {
              object.huipiaohao = resInzj4[c].noteno; // 汇票号
            }
          }
        } else if (bizbilltype == 11) {
          //差旅费报销单 	znbzbx.travelexpensebill.TravelExpenseBillVO  znbzbx  11
        } else if (bizbilltype == 13) {
          //还款单 znbzbx.personalreturnbill.PersonalReturnBillVO  znbzbx  13
        } else if (bizbilltype == 12) {
          //对公预付单 znbzbx.pubprepayloanbill.PubPrePayLoanBillBVO  znbzbx  12
        } else if (bizbilltype == 27) {
          //收款退款单 earap.arRefund.ReceiveRefundHeader  yonbip-fi-earapbill  27
          let sqlInsktk = "SELECT staff from earap.arRefund.ReceiveRefundHeader where code = '" + code + "'"; //收款退款单
          let resInsktk = ObjectStore.queryByYonQL(sqlInsktk, "yonbip-fi-earapbill");
          for (var d = 0; d < resInsktk.length; d++) {
            object.jingbanren = resInsktk[d].staff; //业务员
          }
        } else if (bizbilltype == 28) {
          //付款退款单 earap.apRefund.PaymentRefundHeader  yonbip-fi-earapbill  28
          let sqlInfktk = "SELECT staff from earap.apRefund.PaymentRefundHeader where code = '" + code + "'"; //付款退款单
          let resInfktk = ObjectStore.queryByYonQL(sqlInfktk, "yonbip-fi-earapbill");
          for (var d = 0; d < resInfktk.length; d++) {
            object.jingbanren = resInfktk[d].staff; //业务员
          }
        } else if (bizbilltype == 3) {
          //退款单 znbzbx.pubprepayreturnbill.PubPrePayReturnBillVO  znbzbx  3
        }
        let dataSql = "select id from AT176A3EE417500003.AT176A3EE417500003.Bankjournal where danjuid = '" + object.danjuid + "' and danjubianhao = '" + object.danjubianhao + "' and danjubiaoshi = 2";
        let dataRes = ObjectStore.queryByYonQL(dataSql);
        if (dataRes.length > 0) {
          object.id = dataRes[0].id;
          ObjectStore.updateById("AT176A3EE417500003.AT176A3EE417500003.Bankjournal", object, "BankjournalNewList");
        } else {
          ObjectStore.insert("AT176A3EE417500003.AT176A3EE417500003.Bankjournal", object, "BankjournalNewList");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });