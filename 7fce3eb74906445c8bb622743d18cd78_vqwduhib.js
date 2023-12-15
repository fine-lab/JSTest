let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let sqlInjs2 = "SELECT id,vouchdate,accentity from stwb.settlebench.SettleBench where vouchdate is not null"; //结算工作台
    let resInjs = ObjectStore.queryByYonQL(sqlInjs2, "stwb");
    let arr = [];
    for (var i = 0; i < resInjs.length; i++) {
      let sqlInjs21 = "SELECT id,bizbillno,ourbankaccount,natAmt,receipttypeb,bizbilltype,mainid from stwb.settlebench.SettleBench_b where bizbilltype = 188 and mainid = '" + resInjs[i].id + "'"; //结算工作台
      let resInjs1 = ObjectStore.queryByYonQL(sqlInjs21, "stwb");
      if (resInjs1.length > 0) {
        for (var j = 0; j < resInjs1.length; j++) {
          arr[arr.length] = resInjs1[j];
        }
      }
    }
    return { a: arr };
  }
}
exports({ entryPoint: MyTrigger });