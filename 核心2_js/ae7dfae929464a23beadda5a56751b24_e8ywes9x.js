let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //在动作前可以获取当前业务数据
    let date = param.data[0];
    var sql = "select * from GT25063AT216.GT25063AT216.supplierbkaccA076 where supplier='" + supply + "'and isdefault='Y' and id!='" + id + "'";
    //如果当前设置了default
    if (isdefault == "Y") {
      let resp = ObjectStore.queryByYonQL(sql);
      resp.map((v) => {
        if (v.id == null) {
          throw new Error("当前供应商唯一默认账户已存在，请检查");
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });