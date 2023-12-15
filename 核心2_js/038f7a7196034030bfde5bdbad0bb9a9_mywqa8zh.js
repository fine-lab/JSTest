let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //删除出库数据后更新仓库数据
    //出库数据
    var writeData = request.writeCount;
    //物料id
    var EXprojectId = writeData.EXprojectId;
    //项目id
    var EXproductId = writeData.EXproductId;
    //出库数量
    var EXquantity = writeData.EXquantity;
    //仓库数据
    var sqlSave =
      "select materialCode,amount,usageQuantity,fu.projectVO from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id";
    var resProduct = ObjectStore.queryByYonQL(sqlSave, "developplatform");
    var tag = "false";
    for (var j = 0; j < resProduct.length; j++) {
      //循环仓库数据
      var usageQuantity = resProduct[j].usageQuantity;
      if (usageQuantity == null || usageQuantity == 0) {
        usageQuantity = 0;
      }
      if (EXproductId == resProduct[j].fu_projectVO && EXprojectId == resProduct[j].materialCode && EXquantity + usageQuantity < resProduct[j].amount && usageQuantity - EXquantity >= 0) {
        tag = "true";
        return { tag };
      }
    }
    return { tag };
  }
}
exports({ entryPoint: MyAPIHandler });