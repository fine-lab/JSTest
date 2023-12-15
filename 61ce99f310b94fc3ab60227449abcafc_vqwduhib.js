let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productId = "yourIdHere";
    let code = "DH230522005";
    let sqlInjs2 = "SELECT id,bizbillno,ourbankaccount,natAmt,receipttypeb,bizbilltype from stwb.settlebench.SettleBench_b where bizbillno = 'ZJJS2305090031' "; //结算工作台
    let resInjs = ObjectStore.queryByYonQL(sqlInjs2, "stwb");
    return { a: resInjs };
  }
}
exports({ entryPoint: MyAPIHandler });