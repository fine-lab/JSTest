let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 物料ID
    var materialId = request.materialId;
    if (materialId === undefined) {
      throw new Error("商品不能为空");
    }
    // 分单孙表
    var grandsonsSql = "select * from GT80750AT4.GT80750AT4.fendan1sun1 where shangpin = '" + materialId + "'";
    var grandsons = ObjectStore.queryByYonQL(grandsonsSql);
    return { code: 200, data: grandsons };
  }
}
exports({ entryPoint: MyAPIHandler });