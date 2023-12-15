let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let subcontractVendorId = request.subcontractVendorId; //供应商id
    let suppliesSql = "select supplierCode,id from " + request.app + "." + request.dataBase + "." + "SY01_supply_qualify_licence where supplierCode='" + subcontractVendorId + "' AND enable = '1'";
    let suppliesRes = ObjectStore.queryByYonQL(suppliesSql);
    let result = [];
    if (typeof suppliesRes != "undefined" && suppliesRes != null) {
      let qualificationsId = [];
      for (let i = 0; i < suppliesRes.length; i++) {
        qualificationsId.push(suppliesRes[i].id);
      }
      let childSql =
        "select authType,id,SY01_supply_qualify_licence_id from " +
        request.app +
        "." +
        request.dataBase +
        ".SY01_supply_licence_child where SY01_supply_qualify_licence_id in(" +
        qualificationsId +
        ")";
      let childRes = ObjectStore.queryByYonQL(childSql);
      if (typeof childRes != "undefined" && childRes != null) {
        let childId = [];
        for (let j = 0; j < childRes.length; j++) {
          childId.push(childRes[j].id);
        }
        let sunSql =
          "select authProduct,authProductType,authDosageForm,authSku,SY01_supply_licence_child_id as child_id from " +
          request.app +
          "." +
          request.dataBase +
          ".SY01_supply_licence_sun where SY01_supply_licence_child_id in(" +
          childId +
          ")";
        let sunRes = ObjectStore.queryByYonQL(sunSql);
        if (childRes) {
          for (let k = 0; k < sunRes.length; k++) {
            for (let a = 0; a < childRes.length; a++) {
              if (sunRes[k].child_id == childRes[a].id) {
                result.push({
                  authProduct: sunRes[k].authProduct || null,
                  authProductType: sunRes[k].authProductType || null,
                  authDosageForm: sunRes[k].authDosageForm || null,
                  authSku: sunRes[k].authSku || null,
                  authType: childRes[a].authType || null
                });
              }
            }
          }
        }
      }
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });