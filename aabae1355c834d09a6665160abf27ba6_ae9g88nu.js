let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let getSwitchValue = function (isTrue) {
      if (isTrue == 1 || isTrue == "1" || isTrue == true || isTrue == "true") {
        return "1";
      } else if (isTrue == 0 || isTrue == "0" || isTrue == false || isTrue == "false") {
        return "0";
      }
    };
    let expireDateUnit;
    if (request.expireDateUnit != undefined) {
      expireDateUnit = request.expireDateUnit.toString();
    }
    let isExpiryDateCalculationMethod;
    if (request.isExpiryDateCalculationMethod != undefined) {
      isExpiryDateCalculationMethod = request.isExpiryDateCalculationMethod.toString();
    }
    let yonql = "select id from	GT22176AT10.GT22176AT10.SY01_material_file where enable = 1 and dr = 0  and material = '" + request.materialId + "'";
    let proLicIds = ObjectStore.queryByYonQL(yonql, "sy01");
    for (let i = 0; i < proLicIds.length; i++) {
      let updateJson = {
        id: proLicIds[i].id,
        isBatchManage: getSwitchValue(request.isBatchManage),
        isExpiryDateManage: getSwitchValue(request.isExpiryDateManage),
        expireDateNo: request.expireDateNo,
        expireDateUnit: expireDateUnit,
        specs: request.modelDescription,
        mainUnit: request.unit,
        mainUnitName: request.unitName,
        isExpiryDateCalculationMethod: isExpiryDateCalculationMethod
      };
      let res = ObjectStore.updateById("GT22176AT10.GT22176AT10.SY01_material_file", updateJson, "775b9cd9");
    }
    //产地，生产厂商，只会更新非sku首营信息
    yonql = "select id from	GT22176AT10.GT22176AT10.SY01_material_file where enable = 1 and dr = 0  and material = '" + request.materialId + "' and materialSkuCode = null";
    proLicIds = ObjectStore.queryByYonQL(yonql, "sy01");
    for (let i = 0; i < proLicIds.length; i++) {
      let updateJson = {
        id: proLicIds[i].id,
        producingArea: request.producingArea
      };
      let res = ObjectStore.updateById("GT22176AT10.GT22176AT10.SY01_material_file", updateJson, "775b9cd9");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });