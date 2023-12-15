let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let list = param.data;
    if (list.length > 0) {
      //查询已存在的映射关系
      let sql = "select productcode, phymaterial_code from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable where phymaterial_code = '" + list[0].phymaterial_id_name + "' and  enable = 1";
      var result = ObjectStore.queryByYonQL(sql);
      if (result.length > 0) {
        throw new Error("实物物料编码 : (" + list[0].phymaterial_id_name + ") 已存在!");
      }
    }
  }
}
exports({ entryPoint: MyTrigger });