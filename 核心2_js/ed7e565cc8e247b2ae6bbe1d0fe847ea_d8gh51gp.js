let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.sonData.billOfMaterial;
    //查询主表
    var billOfMaterialSql = "select * from AT15F164F008080007.AT15F164F008080007.BillOfMaterial where id='" + id + "'";
    var billOfMaterialres = ObjectStore.queryByYonQL(billOfMaterialSql, "developplatform");
    var inspectType = billOfMaterialres[0].inspectType;
    if (inspectType == "02") {
      throw new Error("这是委外");
    }
    return { inspectType };
  }
}
exports({ entryPoint: MyAPIHandler });