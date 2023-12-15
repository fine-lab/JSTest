let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 数据库清空
    var object = { danjubiaoshi: "1" };
    var res = ObjectStore.deleteByMap("AT176A3EE417500003.AT176A3EE417500003.Bankjournal", object, "BankjournalNewList");
    //银行对账单
    var sqlIndz = "SELECT id,accentity,tran_date,remark,creditamount,bankaccount,acct_bal from cmp.bankreconciliation.BankReconciliation where creditamount > 0"; //银行对账单 =1
    var resIndz = ObjectStore.queryByYonQL(sqlIndz, "ctm-cmp");
    for (var a = 0; a < resIndz.length; a++) {
      let danjuid = resIndz[a].id; //id
      let gongsi = resIndz[a].accentity; //公司
      let riqi = resIndz[a].tran_date + ""; //日期
      let zhaiyao = resIndz[a].remark; //摘要
      let shouru = resIndz[a].creditamount; //贷方金额 收入
      let zhichu = resIndz[a].debitamount; //借方金额 支出
      let yinxing = resIndz[a].bankaccount; //银行
      let danjubiaoshi = 1; //单据标识
      let acct_bal = resIndz[a].acct_bal; //余额
      let object = {
        danjuid: danjuid,
        gongsi: gongsi,
        riqi: riqi.substring(0, 10),
        zhaiyao: zhaiyao,
        shouru: shouru,
        zhichu: zhichu,
        yinxing: yinxing,
        danjubiaoshi: danjubiaoshi,
        acct_bal: acct_bal
      };
      let resresIndz2 = ObjectStore.insert("AT176A3EE417500003.AT176A3EE417500003.Bankjournal", object, "BankjournalNewList");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });