let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //在动作前可以获取当前业务数据
    let data = param.data[0];
    var { isdefault, supplier, id } = data;
    var sql = "select * from GT21468AT108.GT21468AT108.supplyclassA062 where supplier='" + supplier + "' and isdefault='Y' and id!='" + id + "'";
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