let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  //依据物料id，获取此物料的首营方式，0物料，1sku，2特征
  execute(request) {
    let queryType = "select isSku from GT22176AT10.GT22176AT10.SY01_material_file where material = '" + request.materialId + "'";
    return { type: ObjectStore.queryByYonQL(queryType, "sy01")[0].isSku };
  }
}
exports({ entryPoint: MyAPIHandler });