let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    var { isdefault, supplier, id } = data;
    var sql = "select id from GT25155AT5.GT25155AT5.supplierbankacczr where supplier='" + supplier + "' and isdefault='Y' and id!='" + id + "'";
    //如果当前设置了default
    if (isdefault == "Y") {
      let resp = ObjectStore.queryByYonQL(sql);
      resp.map((v) => {
        if (v.id !== null) {
          throw new Error("当前供应商唯一默认账户已存在，请检查！");
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });