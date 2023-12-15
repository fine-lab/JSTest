let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var Materialcode = request.BOM.bomCode;
    var importName = request.BOM.importName; //name
    //查询自定义档案维护
    var importSql = "select * from bd.basedocdef.CustomerDocVO where name='" + importName + "'";
    var importSqlRes = ObjectStore.queryByYonQL(importSql, "ucfbasedoc");
    if (importSqlRes.length == 0) {
      throw new Error("没有" + importName + "小组");
    }
    var customer = {};
    customer.name = importSqlRes[0].name;
    customer.id = importSqlRes[0].id;
    //查询BOM物料清单维护
    var Materialsql = "select * from AT15F164F008080007.AT15F164F008080007.BillOfMaterial where bombianma='" + Materialcode + "'";
    var materialsqlResponse = ObjectStore.queryByYonQL(Materialsql, "developplatform");
    if (materialsqlResponse.length == 0) {
      throw new Error("没有这个【" + Materialcode + "】BOM的数据");
    }
    var bomEquipmentStatus = materialsqlResponse[0].equipmentStatus;
    if (bomEquipmentStatus != "1") {
      throw new Error("这个【" + Materialcode + "】BOM,是未启用状态。");
    }
    var bo = {};
    bo.bomid = materialsqlResponse[0].id;
    bo.bomcode = materialsqlResponse[0].bombianma;
    bo.bomName = materialsqlResponse[0].bommingchen;
    bo.bomType = materialsqlResponse[0].inspectType;
    //查询工序BOM维护子表
    var billOfMaterial = materialsqlResponse[0].id;
    var workingzbsql = "select * from AT15F164F008080007.AT15F164F008080007.processBOMSon where billOfMaterial='" + billOfMaterial + "'";
    var workingzbsqlResponse = ObjectStore.queryByYonQL(workingzbsql, "developplatform");
    if (workingzbsqlResponse.length == 0) {
      throw new Error("这个" + Materialcode + "BOM还没有工序");
    }
    //查询工序BOM维护主表
    var workingZhubId = workingzbsqlResponse[0].processBOM_id;
    var workingsql = "select * from AT15F164F008080007.AT15F164F008080007.processBOM where id='" + workingZhubId + "'";
    var workingsqlResponse = ObjectStore.queryByYonQL(workingsql, "developplatform");
    if (workingsqlResponse.length == 0) {
      throw new Error("这个" + Materialcode + "BOM还没有工序");
    }
    var workEquipmentStatus = workingsqlResponse[0].equipmentStatus;
    if (workEquipmentStatus != "1") {
      throw new Error("这个【" + Materialcode + "】BOM,是未启用状态。");
    }
    var work = {};
    work.workingId = workingZhubId;
    work.workingCode = workingsqlResponse[0].gongxubianma;
    work.workingName = workingsqlResponse[0].gongxumingchen;
    var bomponse = {};
    bomponse.bom = bo;
    bomponse.working = work;
    bomponse.customerDoc = customer;
    return { bomponse };
  }
}
exports({ entryPoint: MyAPIHandler });