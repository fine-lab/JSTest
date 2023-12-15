let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询单据
    let org = request.org;
    let material = request.material;
    let ckNoSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" + org + "' and material = '" + material + "'";
    let rsData = ObjectStore.queryByYonQL(ckNoSql, "sy01");
    var storageSql = "select * from GT22176AT10.GT22176AT10.SY01_stocondv2 where id = " + rsData[0].storageCondition;
    var storageRes = ObjectStore.queryByYonQL(storageSql);
    rsData[0].storageConditionName = storageRes[0].storageName;
    return { rsData };
  }
}
exports({ entryPoint: MyAPIHandler });