let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let return_info = [];
    let Info = [];
    let id = request.id;
    let invoiceOrg = request.invoiceOrg;
    const sql1 = "select * from GT22176AT10.GT22176AT10.SY01_xsckfmx_v6  where dr = 0 and sourcechild_id  = '" + id + "'";
    let list = ObjectStore.queryByYonQL(sql1);
    if (list.length > 0) {
      let materials = [];
      let locations = [];
      for (let i = 0; i < list.length; i++) {
        materials.push(list[i].material);
        if (typeof list[i].location != "undefined") {
          locations.push(list[i].location);
        }
      }
      let str_materials = materials.join(",");
      //从医药物料档案查询存储条件
      const sql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" + invoiceOrg + "' and material in (" + str_materials + ")";
      let productInfors = ObjectStore.queryByYonQL(sql, "sy01");
      let storageConditionObj = {};
      if (productInfors.length > 0) {
        for (let i = 0; i < productInfors.length; i++) {
          storageConditionObj[productInfors[i].material] = productInfors[i];
        }
      }
      if (locations.length > 0) {
        //从货位档案查询货位名称
        let str_locations = locations.join(",");
        const locationSql = "select * from aa.goodsposition.GoodsPosition where id in (" + str_locations + ")";
        let locationRes = ObjectStore.queryByYonQL(locationSql, "productcenter");
        let locationObj = {};
        if (locationRes.length > 0) {
          for (let i = 0; i < locationRes.length; i++) {
            locationObj[locationRes[i].id] = locationRes[i];
          }
        }
        for (let i = 0; i < list.length; i++) {
          list[i].storageCondition = storageConditionObj[list[i].material].storageCondition;
          list[i].storageConditionName = storageConditionObj[list[i].material].storageConditionName;
          list[i].locationName = locationObj[list[i].location].name;
        }
      }
    }
    return { res: JSON.stringify(list) };
  }
}
exports({ entryPoint: MyAPIHandler });