let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let materialIds = request.materialIds;
    let materialInfos = {};
    //先查询gmp中的值
    let querySql = "select * from ISY_2.ISY_2.SY01_gmp_supplies_file where orgId = '" + orgId + "'";
    let storageConditions = ObjectStore.queryByYonQL(querySql, "sy01");
    for (let i = 0; i < storageConditions.length; i++) {
      if (!materialInfos.hasOwnProperty(storageConditions[i].material)) {
        materialInfos[storageConditions[i].material] = {};
      }
      materialInfos[storageConditions[i].material].storage = storageConditions[i].storageCondition;
      materialInfos[storageConditions[i].material].storageName = storageConditions[i].storageConditionName;
    }
    for (let key in materialInfos) {
      if (materialInfos[key].storageName == undefined) {
        let selectStorageName = "select storageName from GT22176AT10.GT22176AT10.SY01_stocondv2 where id = '" + materialInfos[key].storage + "'";
        materialInfos[key].storageName = ObjectStore.queryByYonQL(selectStorageName, "sy01")[0].storageName;
      }
    }
    return {
      materialInfos: materialInfos
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});