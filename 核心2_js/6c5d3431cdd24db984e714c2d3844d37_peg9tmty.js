let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param.data[0].id;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production where id='" + id + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    // 获取启用状态
    var enable = result[0].enable;
    // 获取生产企业编号
    var production_numbers = result[0].production_numbers;
    if (enable == 1) {
      throw new Error("生产企业编号：'" + production_numbers + "' ,为启用状态不可删除");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });