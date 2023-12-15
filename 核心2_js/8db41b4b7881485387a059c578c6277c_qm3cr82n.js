let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 业务逻辑：判断默认账户是否唯一
    let data = param.data[0];
    var { isdefault, supplier, id } = data;
    var sql = "select id from AT16139EE209C8000A.AT16139EE209C8000A.supplierBankAcc_sr where supplier='" + supplier + "' and isdefault='Y' and id !='" + id + "'";
    // 如果当前设置了 default
    if (isdefault === "Y") {
      let resp = ObjectStore.queryByYonQL(sql);
      resp.map((item) => {
        if (item.id !== null) {
          throw new Error("当前供应商唯一默认账户已存在，请检查！");
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });