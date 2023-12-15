let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pruductId = request.obj;
    //查询已存在的物料
    let sql = "select productcode, phymaterial_code from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable where phymaterial_id = '" + pruductId + "' and enable = 1";
    var result = ObjectStore.queryByYonQL(sql);
    if (result.length > 0) {
      throw new Error("映射关系已存在, 启用失败");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });