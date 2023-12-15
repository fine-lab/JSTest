let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    var { yesorno, supplier, id } = data;
    var sql = "select id from GT7259AT89.GT7259AT89.supplierbankacc where supplier = '" + supplier + "' and yesorno = 'Y' and id !='" + id + "'";
    //如果当前设置了默认账户
    if (yesorno == "Y") {
      let resp = ObjectStore.queryByYonQL(sql);
      resp.map((v) => {
        if (v.id != null) {
          throw new Error("当前供应商唯一默认账户已存在，请检查！");
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });