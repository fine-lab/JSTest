let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //在动作起岸可以插入函数提供功能
    let data = param.data[0];
    var { isdefault, supplier, id } = data;
    var sql = "select * fromGT21458AT98.GT21458AT98.supplyclassA042  where supplier='" + supplier + "' and isdefault='Y' and id!='" + id + "'";
    //如果当前设置了 default
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