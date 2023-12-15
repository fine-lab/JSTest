let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let materialIds = request.materialIds;
    let materialInfos = {};
    //先查询gmp中的值
    try {
      let querySql = "select material,storageCondition,storageConditionName from  ISY_2.ISY_2.SY01_gmp_supplies_file where org_id = '" + orgId + "' and material in (";
      for (let id of materialIds) {
        querySql += "'" + id + "',";
      }
      querySql = querySql.substring(0, querySql.length - 1) + ")";
      let storageConditions = ObjectStore.queryByYonQL(querySql, "sy01");
      for (let i = 0; i < storageConditions.length; i++) {
        if (!materialInfos.hasOwnProperty(storageConditions[i].material)) {
          materialInfos[storageConditions[i].material] = {};
        }
        materialInfos[storageConditions[i].material].storage = storageConditions[i].storageCondition;
        materialInfos[storageConditions[i].material].storageName = storageConditions[i].storageConditionName;
      }
    } catch (e) {}
    //如果gsp中也设置了相关数值，那么用gsp覆盖
    try {
      let querySql = "select material,storageCondition,storageConditionName from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" + orgId + "' and material in (";
      for (let id of materialIds) {
        querySql += "'" + id + "',";
      }
      querySql = querySql.substring(0, querySql.length - 1) + ")";
      let storageConditions = ObjectStore.queryByYonQL(querySql, "sy01");
      for (let i = 0; i < storageConditions.length; i++) {
        if (!materialInfos.hasOwnProperty(storageConditions[i].material)) {
          materialInfos[storageConditions[i].material] = {};
        }
        materialInfos[storageConditions[i].material].storage = storageConditions[i].storageCondition;
        materialInfos[storageConditions[i].material].storageName = storageConditions[i].storageConditionName;
      }
    } catch (e) {}
    return { materialInfos: materialInfos };
  }
}
exports({ entryPoint: MyAPIHandler });