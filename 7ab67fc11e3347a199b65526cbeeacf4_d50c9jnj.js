let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let list = param.data;
    if (list[0].phymaterial_id == null) {
      throw new Error("实物物料Id不存在,请检查数据");
    }
    //查询已存在的物料
    let sql = "select productcode, phymaterial_code from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable where phymaterial_id = '" + list[0].phymaterial_id + "' and enable = 1";
    var result = ObjectStore.queryByYonQL(sql);
    if (result.length > 0) {
      throw new Error("映射关系已存在, 启用失败");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });