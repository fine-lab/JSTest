let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    var { isdefault, supplier, id } = data;
    var sql = "select id from GT65839AT2.GT65839AT2.SupplierBank where supplier = '" + supplier + "' and isdefault = 'Y' and id != '" + id + "'";
    //若果当前设置了default
    if (isdefault == "Y") {
      let resp = ObjectStore.queryByYonQL(sql);
      resp.map((v) => {
        if (v.id !== null) {
          throw new Error("当前客户唯一默认银行账户已经存在，请检查！");
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });