let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let materialId = request.materialId;
    let orgId = request.orgId;
    let suppliesRes = [];
    if (typeof materialId != "undefined" && materialId != null) {
      let suppliesSql = "select * from ISY_2.ISY_2.SY01_gmp_supplies_file where material = '" + materialId + "' and org_id = '" + orgId + "'";
      suppliesRes = ObjectStore.queryByYonQL(suppliesSql, "sy01");
      if (typeof suppliesRes != "undefined" && suppliesRes != null) {
        if (suppliesRes.length < 1) {
          suppliesRes = [];
          return { suppliesRes };
        } else if (suppliesRes.length > 0) {
          let productTplId = suppliesRes[0].productTemplate;
          //查询物料模板
          if (typeof productTplId != "undefined" && productTplId != null) {
            let productTplSql = "select * from pc.tpl.ProductTpl where id = " + productTplId;
            let productTplRes = ObjectStore.queryByYonQL(productTplSql, "productcenter");
            suppliesRes[0].productTemplate_id = productTplRes[0].id;
            suppliesRes[0].productTemplate_name = productTplRes[0].name;
          }
          return { suppliesRes };
        }
      } else {
        suppliesRes = [];
        return { suppliesRes };
      }
    } else {
      suppliesRes = [];
      return { suppliesRes };
    }
  }
}
exports({ entryPoint: MyAPIHandler });