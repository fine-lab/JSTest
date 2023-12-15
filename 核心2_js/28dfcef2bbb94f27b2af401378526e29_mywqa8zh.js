let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //出库数据
    var verifyCount = request.verifyCount;
    //物料id
    var EXprojectId = verifyCount.EXprojectId;
    //项目id
    var EXproductId = verifyCount.EXproductId;
    //出库数量
    var EXquantity = verifyCount.EXquantity;
    //仓库数据
    var sqlSave =
      "select materialCode,amount,usageQuantity,fu.projectVO from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id";
    var resProduct = ObjectStore.queryByYonQL(sqlSave, "developplatform");
    var tag = "false";
    //循环仓库数据
    for (var j = 0; j < resProduct.length; j++) {
      var usageQuantity = resProduct[j].usageQuantity;
      if (usageQuantity == null || usageQuantity == 0) {
        usageQuantity = 0;
      }
      //判断物料,项目相同,使用数量加出库数量小于总数量
      if (EXproductId == resProduct[j].fu_projectVO && EXprojectId == resProduct[j].materialCode && EXquantity + usageQuantity < resProduct[j].amount) {
        tag = "true";
        return { tag };
      }
    }
    return { tag };
  }
}
exports({ entryPoint: MyAPIHandler });