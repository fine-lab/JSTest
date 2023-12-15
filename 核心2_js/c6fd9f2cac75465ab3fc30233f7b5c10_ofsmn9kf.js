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
    if (typeof masterRes != "undefined") {
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
          }
        }
        releasePlanData = proDetailList.data;
        if (typeof releasePlanData != "undefined" && releasePlanData != null) {
          return { releasePlanData };
        } else {
          for (let j = 0; j < masterRes.length; j++) {
            if (typeof masterRes[j].materialClassId != "undefined") {
              //查询原厂物料分类
              let suppliesSql = "select * from pc.cls.ManagementClass where id = " + masterRes[j].materialClassId;
              let suppliesRes = ObjectStore.queryByYonQL(suppliesSql, "productcenter");
              if (suppliesRes.length > 0) {
                proDetailList = extrequire("ISY_2.public.getPassProduct").execute({
                  planId: masterRes[j].releasePlan
                });
              }
            }
          }
        }
        releasePlanData = proDetailList.data;
        if (typeof releasePlanData != "undefined" && releasePlanData != null) {
          let releasePlanChildSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk = " + releasePlanData[0].releasePlan;
          let releasePlanChildRes = ObjectStore.queryByYonQL(releasePlanChildSql);
          if (releasePlanChildRes.length > 0) {
            releasePlanData[0].release_items_childList = releasePlanChildRes;
          }
        } else if (true) {
          throw new Error("该物料没有对应的放行方案");
        }
      }
    } else {
      releasePlanData = [];
    }
    return { releasePlanData };
  }
}
exports({ entryPoint: MyAPIHandler });