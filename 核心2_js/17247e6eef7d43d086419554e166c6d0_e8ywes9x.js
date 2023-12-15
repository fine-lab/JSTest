let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //在动作前可以获取当前业务数据
    let data = param.data[0];
    //定义三个变量
    var { isdefault, supply_pp01, id } = data;
    var sql = "select id from GT26154AT225.GT26154AT225.supplierbank_pp01 where  supply_pp01='" + supply_pp01 + "'  and  isdefault='Y' and id !='" + id + "' ";
    //如果当前设置了default
    if (isdefault == "Y") {
      var res = ObjectStore.queryByYonQL(sql);
      //遍历结果
      res.map((v) => {
        if (v.id !== null) {
          throw new Error("当前供应商唯一默认账户已存在，请检查！");
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });