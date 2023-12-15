let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //待校验的银行账号
    let BankAccount_nos = request.BankAccount_nos;
    //未初始化的银行账号
    let noInitialize = [];
    for (let i = 0; i < BankAccount_nos.length; i++) {
      let BankAccount_no = BankAccount_nos[i];
      let sql = "select count(id) from AT1833A66C08480009.AT1833A66C08480009.BankAccBalance where BankAccount_no = '" + BankAccount_no + "' and verifystate = 2 and dr = 0";
      let res = ObjectStore.queryByYonQL(sql);
      if (res[0].id == 0) {
        noInitialize.push(BankAccount_no);
      } else if (res[0].id > 1) {
        throw new Error("\n账号" + BankAccount_no + "\n不止一条余额初始化记录,请检查！");
      }
    }
    return { noInitialize };
  }
}
exports({ entryPoint: MyAPIHandler });