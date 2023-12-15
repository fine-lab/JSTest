let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let productId = request.productId == null ? "" : request.productId;
    let skuId = request.skuId;
    let yonql = "select isSku from GT22176AT10.GT22176AT10.SY01_material_file where org_id= '" + orgId + "' and material = '" + productId + "' limit 0,1";
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    if (res.length == 0) {
      return { code: "0", info: null };
    }
    let isSku = res[0].isSku;
    //如果是物料维度，那么就无视sku
    if (isSku == 0 || isSku == "0") {
      let yonql1 = "select id from GT22176AT10.GT22176AT10.SY01_material_file where org_id= '" + orgId + "' and material = '" + productId + "' limit 0,1";
      let res1 = ObjectStore.queryByYonQL(yonql1, "sy01");
      if (res1.length == 0) {
        return { code: "0", info: null };
      }
      let obj = {
        id: res1[0].id,
        compositions: [
          {
            name: "SY01_material_file_childList"
          }
        ]
      };
      let proLicInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_material_file", obj);
      return { code: "1", info: proLicInfo };
    }
    if (isSku == 2 || isSku == "2") {
      return { code: "0", info: null };
    }
    //如果是sku维度
    if (isSku == 1 || isSku == "1") {
      if (skuId == undefined) {
        return { code: "1", info: {} };
      }
      let yonql1 = "select id from GT22176AT10.GT22176AT10.SY01_material_file where org_id= '" + orgId + "' and material = '" + productId + "' and materialSkuCode = '" + skuId + "' limit 0,1";
      let res1 = ObjectStore.queryByYonQL(yonql1, "sy01");
      if (res1.length == 0) {
        return { code: "0", info: null };
      }
      let obj = {
        id: res1[0].id,
        compositions: [
          {
            name: "SY01_material_file_childList"
          }
        ]
      };
      let proLicInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_material_file", obj);
      return { code: "1", info: proLicInfo };
    }
  }
}
exports({ entryPoint: MyAPIHandler });