let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
       [光标位置]
    let yonql = "select id from GT22176AT10.GT22176AT10.SY01_material_file where org_id=" + request.orgId + " and material = " + request.materialId + " and materialSkuCode=" + request.sku;
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    if (res.length == 0) {
      return { proLicInfo: null };
    } else {
      let obj = {
        id: res[0].id,
        compositions: [
          {
            name: "SY01_material_file_childList"
          }
        ]
      };
      let proLicInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_material_file", obj);
      return { proLicInfo: proLicInfo };
    }
  }
}
exports({ entryPoint: MyAPIHandler });