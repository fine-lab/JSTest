let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //删除出库数据后更新仓库数据
    //出库数据
    var writeData = request.writeCount;
    //仓库数据
    var sqlSave =
      "select materialCode,amount,usageQuantity,fu.projectVO from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id";
    var resProduct = ObjectStore.queryByYonQL(sqlSave, "developplatform");
    var tag = 0;
    var tag1 = "false";
    for (var i = 0; i < request.writeCount.length; i++) {
      for (var j = 0; j < resProduct.length; j++) {
        //循环仓库数据
        var usageQuantity = resProduct[j].usageQuantity;
        if (usageQuantity == null || usageQuantity == 0) {
          usageQuantity = 0;
        }
        if (
          writeData[i].projectVO == resProduct[j].fu_projectVO &&
          writeData[i].product == resProduct[j].materialCode &&
          writeData[i].sl + usageQuantity < resProduct[j].amount &&
          usageQuantity - writeData[i].sl >= 0
        ) {
          tag++;
        }
      }
    }
    if (tag == request.writeCount.length) {
      tag1 = "true";
    }
    return { tag1 };
  }
}
exports({ entryPoint: MyAPIHandler });