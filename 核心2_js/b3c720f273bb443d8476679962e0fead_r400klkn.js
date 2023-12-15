let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let errorMsg = "";
    let queryGSPParam = "select org_id,stoconditioncontrol from GT22176AT10.GT22176AT10.SY01_gspmanparamsv3 where org_id = " + request.orgId;
    let GSPParamInfo = ObjectStore.queryByYonQL(queryGSPParam);
    if (GSPParamInfo == undefined || GSPParamInfo.length == 0) {
      return { errorMsg };
    }
    if (GSPParamInfo[0].stoconditioncontrol == undefined || GSPParamInfo[0].stoconditioncontrol == 2 || GSPParamInfo[0].stoconditioncontrol == "2") {
      return { errorMsg };
    }
    let queryWareHouse = "select id,name,extend_temperature_up,extend_temperature_down,extend_humidity_up,extend_humidity_down  from  aa.warehouse.Warehouse where id = " + request.wareHouseId;
    let warehouseInfo = ObjectStore.queryByYonQL(queryWareHouse, "productcenter")[0];
    let querySql = "select material,materialSkuCode,storageCondition from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" + request.orgId + "' and material in (";
    for (let i = 0; i < request.materalIds.length; i++) {
      querySql += "'" + request.materalIds[i].id + "',";
    }
    querySql = querySql.substring(0, querySql.length - 1) + ")";
    let materialCctjs = ObjectStore.queryByYonQL(querySql, "sy01");
    let storageConditions = ObjectStore.queryByYonQL("select * from  GT22176AT10.GT22176AT10.SY01_stocondv2");
    for (let i = 0; i < request.materalIds.length; i++) {
      //找到物料的存储条件,如果传了sku，那么就尽量去匹配首营sku的信息，没有没有传sku，那么直接去找首营物料信息即可
      let storageCondition;
      for (let j = 0; j < materialCctjs.length; j++) {
        if (request.materalIds[i].sku == undefined && materialCctjs[j].material == request.materalIds[i].id) {
          storageCondition = materialCctjs[j].storageCondition;
          break;
        }
        if (request.materalIds[i].sku != undefined) {
          if (materialCctjs[j].material == request.materalIds[i].id) {
            storageCondition = materialCctjs[j].storageCondition;
          }
          if (materialCctjs[j].material == request.materalIds[i].id && materialCctjs[j].materialSkuCode == request.materalIds[i].sku) {
            storageCondition = materialCctjs[j].storageCondition;
            break;
          }
        }
      }
      //用存储条件id，匹配所有的存储条件，判断是否复核存储条件
      if (storageCondition != undefined) {
        for (let j = 0; j < storageConditions.length; j++) {
          if (storageCondition == storageConditions[j].id) {
            if (
              warehouseInfo.extend_temperature_up > storageConditions[j].maxTemperature ||
              warehouseInfo.extend_temperature_down < storageConditions[j].minTemperature ||
              warehouseInfo.extend_humidity_up > storageConditions[j].maxHumidity ||
              warehouseInfo.extend_humidity_down < storageConditions[j].minHumidity
            ) {
              errorMsg += "第" + (i + 1) + "行物料【" + request.materalIds[i].name + "】的存储条件与仓库温湿度不匹配,请检查\n";
            }
            if (
              (warehouseInfo.extend_temperature_up == undefined && storageConditions[j].maxTemperature != undefined) ||
              (warehouseInfo.extend_temperature_down == undefined && storageConditions[j].minTemperature != undefined) ||
              (warehouseInfo.extend_humidity_up == undefined && storageConditions[j].maxHumidity != undefined) ||
              (warehouseInfo.extend_humidity_down == undefined && storageConditions[j].minHumidity != undefined)
            ) {
              errorMsg += "第" + (i + 1) + "行物料【" + request.materalIds[i].name + "】存储条件有要求，但是仓库没有相关数值\n";
            }
            break;
          }
        }
      }
    }
    return { errorMsg };
  }
}
exports({ entryPoint: MyAPIHandler });