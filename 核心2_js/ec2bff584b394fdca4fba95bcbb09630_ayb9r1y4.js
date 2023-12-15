let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 从前端获取id
    var pid = param.data[0].id;
    var sql = "select * from GT102917AT3.GT102917AT3.subcontract where id = '" + pid + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res[0].frequency != 0) {
      throw new Error("该合同号已经被引用,不允许删除");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });