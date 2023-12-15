let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 数据库清空
    var object = { danjubiaoshi: "4" };
    var res = ObjectStore.deleteByMap("AT176A3EE417500003.AT176A3EE417500003.Bankjournal", object, "BankjournalNewList");
    //转账单
    var sqlIndz =
      "SELECT code,outBrokerageNatSum,natSum,id,accentity,settledate,settlestatus,description,payBankAccount,recBankAccount,noteno,characterDef from cm.transferaccount.TransferAccount where settlestatus = 2"; //转账单 =4
    var resIndz = ObjectStore.queryByYonQL(sqlIndz, "ctm-cmp");
    let arr = []; //存储数组
    for (var a = 0; a < resIndz.length; a++) {
      let danjuid = resIndz[a].id; //id
      let gongsi = resIndz[a].accentity; //公司
      let riqi = resIndz[a].settledate + ""; //日期
      let zhaiyao = resIndz[a].description; //摘要
      let danjubiaoshi = 4; //单据标识
      let code = resIndz[a].code; //单据编号
      let money = resIndz[a].natSum; // 金额
      let piaodaoqiri = null;
      if (resIndz[a].characterDef && resIndz[a].characterDef.PJDQR) {
        piaodaoqiri = resIndz[a].characterDef.PJDQR;
      }
      let huipiaohao = resIndz[a].noteno;
      //支出
      var yinxing1 = resIndz[a].payBankAccount; //付款银行
      if (yinxing1) {
        let object1 = {
          danjuid: danjuid,
          gongsi: gongsi,
          riqi: riqi.substring(0, 10),
          piaodaoqiri: piaodaoqiri,
          huipiaohao: huipiaohao,
          danjubianhao: code,
          zhaiyao: zhaiyao,
          zhichu: money,
          yinxing: yinxing1,
          danjubiaoshi: danjubiaoshi
        };
        arr[arr.length] = object1;
      }
      //收入
      var yinxing2 = resIndz[a].recBankAccount; //收款银行
      if (yinxing2) {
        var shouru = money;
        if (resIndz[a].outBrokerageNatSum) {
          shouru = money - resIndz[a].outBrokerageNatSum; //减去手续费
        }
        let object2 = {
          danjuid: danjuid,
          gongsi: gongsi,
          riqi: riqi.substring(0, 10),
          piaodaoqiri: piaodaoqiri,
          huipiaohao: huipiaohao,
          danjubianhao: code,
          zhaiyao: zhaiyao,
          shouru: shouru,
          yinxing: yinxing2,
          danjubiaoshi: danjubiaoshi
        };
        arr[arr.length] = object2;
      }
    }
    let resresIndz2 = ObjectStore.insertBatch("AT176A3EE417500003.AT176A3EE417500003.Bankjournal", arr, "BankjournalNewList");
    return {};
  }
}
exports({ entryPoint: MyTrigger });