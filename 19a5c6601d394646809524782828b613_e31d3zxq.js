let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let huopinIds = [];
    let orgSql = "select productId from pc.product.ProductApplyRange where orgId = '" + request.orgId + "'"; //根据库存组织查询
    let org = ObjectStore.queryByYonQL(orgSql, "productcenter");
    let finOrgSql = "select  material productId from GT22176AT10.GT22176AT10.SY01_material_file where  org_id = '" + request.finOrg + "'"; //判断首营
    let finOrg = ObjectStore.queryByYonQL(finOrgSql);
    for (let i = 0; i < org.length; i++) {
      for (let j = 0; j < finOrg.length; j++) {
        if (org[i].productId == finOrg[j].productId && !huopinIds.includes(org[i].productId)) {
          huopinIds.push(org[i].productId);
          finOrg.splice(j, 1);
          break;
        }
      }
    }
    return { huopinIds: huopinIds };
  }
}
exports({ entryPoint: MyAPIHandler });