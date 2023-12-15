let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //放行方案:
    let materialId = request.materialId;
    let orgId = request.orgId;
    let skuId = request.skuId;
    let releasePlanData = [];
    let masterSql = "select * from ISY_2.ISY_2.release_plan_material where org_id = " + orgId;
    let masterRes = ObjectStore.queryByYonQL(masterSql);
    let proDetailList = {};
    if (masterRes.length > 0) {
      for (let i = 0; i < masterRes.length; i++) {
        if (typeof skuId != "undefined" && skuId != null) {
          if (typeof masterRes[i].skuCode != "undefined") {
            if (masterRes[i].skuCode == skuId) {
              proDetailList = extrequire("ISY_2.public.getPassProduct").execute({
                planId: masterRes[i].releasePlan
              });
            } else {
              continue;
            }
          } else if (typeof masterRes[i].materialCode != "undefined") {
            if (masterRes[i].materialCode == materialId) {
              proDetailList = extrequire("ISY_2.public.getPassProduct").execute({
                planId: masterRes[i].releasePlan
              });
            } else {
              continue;
            }
          }
        } else if (typeof masterRes[i].materialCode != "undefined") {
          if (masterRes[i].materialCode == materialId) {
            proDetailList = extrequire("ISY_2.public.getPassProduct").execute({
              planId: masterRes[i].releasePlan
            });
          } else {
            continue;
          }
        } else if (typeof masterRes[i].materialClassCode != "undefined") {
          //查询GMP医药物料档案
          let suppliesSql = "select * from ISY_2.ISY_2.SY01_gmp_supplies_file where material = " + materialId + " and org_id = " + orgId;
          let suppliesRes = ObjectStore.queryByYonQL(suppliesSql);
          if (suppliesRes.length > 0) {
            if (masterRes[i].materialClassCode == suppliesRes[0].materialType) {
              proDetailList = extrequire("ISY_2.public.getPassProduct").execute({
                planId: masterRes[i].releasePlan
              });
            } else {
              continue;
            }
          } else {
            throw new Error("GMP医药物料档案中没有该物料");
          }
        }
      }
      releasePlanData = proDetailList.data;
      if (releasePlanData.length < 1) {
        throw new Error("该物料没有对应的放行方案");
      }
      let releasePlanChildSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk = " + releasePlanData[0].releasePlan;
      let releasePlanChildRes = ObjectStore.queryByYonQL(releasePlanChildSql);
      if (releasePlanChildRes.length > 0) {
        releasePlanData[0].release_items_childList = releasePlanChildRes;
      }
    }
    return { releasePlanData };
  }
}
exports({ entryPoint: MyAPIHandler });