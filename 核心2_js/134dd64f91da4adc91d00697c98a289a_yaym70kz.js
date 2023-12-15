let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgSql = "select id as id,org_id as orgId,pk_org_v as pkOrgV from AT168837E809980003.AT168837E809980003.ad_pu1";
    var result = ObjectStore.queryByYonQL(orgSql);
    for (var i = 0; i < result.length; i++) {
      let orgid = result[i].orgId; //组织id
      let id = result[i].id; //id
      let pkOrgV = result[i].pkOrgV; //采购组织id
      var object = { id: id, org_id: pkOrgV };
      var res = ObjectStore.updateById("AT168837E809980003.AT168837E809980003.ad_pu1", object, "ybf0122bfb");
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });