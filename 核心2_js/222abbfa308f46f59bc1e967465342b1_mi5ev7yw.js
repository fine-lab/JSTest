let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let skuId = request.skuId;
    let materialId = request.materialId;
    let businessType = request.businessType;
    let result = {};
    let releasePlan = [];
    let masterSql = "select * from ISY_2.ISY_2.release_plan_material where org_id = " + request.orgId + " and businessType like " + "'" + businessType + "'";
    let releasePlanMaterial = ObjectStore.queryByYonQL(masterSql);
    if (typeof releasePlanMaterial != "undefined" && releasePlanMaterial != null) {
      let proDetailList = {};
      if (releasePlanMaterial.length > 0) {
        for (let i = 0; i < releasePlanMaterial.length; i++) {
          if (request.skuId != "undefined" && request.skuId != null) {
            if (typeof releasePlanMaterial[i].skuCode != "undefined" && releasePlanMaterial[i].skuCode != null) {
              if (releasePlanMaterial[i].skuCode == request.skuId) {
                let releasePlanId = releasePlanMaterial[i].releasePlan;
                let releasePlanSql = "select * from ISY_2.ISY_2.release_plan where id=" + releasePlanId;
                let releasePlanRes = ObjectStore.queryByYonQL(releasePlanSql);
                if (typeof releasePlanMaterial != "undefined" && releasePlanMaterial != null) {
                  if (releasePlanMaterial.length > 0) {
                    let releasePlanListSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk=" + releasePlanId;
                    let releaseItemsChild = ObjectStore.queryByYonQL(releasePlanListSql);
                    if (typeof releaseItemsChild != "undefined" && releaseItemsChild != null) {
                      if (releaseItemsChild.length > 0) {
                        releasePlanRes[0].releaseOrderChild = releaseItemsChild;
                      }
                      releasePlan.push(releasePlanRes[0]); //result.
                    }
                  } else {
                    continue;
                  }
                }
              }
            } else if (typeof releasePlanMaterial[i].materialCode != "undefined" && releasePlanMaterial[i].materialCode != null) {
              if (releasePlanMaterial[i].materialCode == materialId) {
                let releasePlanId = releasePlanMaterial[i].releasePlan;
                let releasePlanSql = "select * from ISY_2.ISY_2.release_plan where id=" + releasePlanId;
                let releasePlanRes = ObjectStore.queryByYonQL(releasePlanSql);
                let releasePlanListSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk=" + releasePlanId;
                let releaseItemsChild = ObjectStore.queryByYonQL(releasePlanListSql);
                if (releaseItemsChild.length > 0) {
                  releasePlanRes[0].releaseOrderChild = releaseItemsChild;
                }
                releasePlan.push(releasePlanRes[0]);
              } else {
                continue;
              }
            }
          } else if (typeof releasePlanMaterial[i].materialCode != "undefined" && releasePlanMaterial[i].materialCode != null) {
            if (releasePlanMaterial[i].materialCode == materialId) {
              let releasePlanId = releasePlanMaterial[i].releasePlan;
              let releasePlanSql = "select * from ISY_2.ISY_2.release_plan where id=" + releasePlanId;
              let releasePlanRes = ObjectStore.queryByYonQL(releasePlanSql);
              let releasePlanListSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk=" + releasePlanId;
              let releaseItemsChild = ObjectStore.queryByYonQL(releasePlanListSql);
              if (releaseItemsChild.length > 0) {
                releasePlanRes[0].releaseOrderChild = releaseItemsChild;
              }
              releasePlan.push(releasePlanRes[0]);
            } else {
              continue;
            }
          }
          if (typeof releasePlanMaterial[i].materialClassId != "undefined") {
            let proDetailInfoSql = "select * from pc.product.Product where id = " + materialId + " and manageClass = " + releasePlanMaterial[i].materialClassId;
            let proDetailInfoList = ObjectStore.queryByYonQL(proDetailInfoSql, "productcenter");
            if (typeof proDetailInfoList != "undefined" && proDetailInfoList != null) {
              if (proDetailInfoList.length > 0) {
                let releasePlanId = releasePlanMaterial[i].releasePlan;
                let releasePlanSql = "select * from ISY_2.ISY_2.release_plan where id=" + releasePlanId;
                let releasePlanRes = ObjectStore.queryByYonQL(releasePlanSql);
                let releasePlanListSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk=" + releasePlanId;
                let releaseItemsChild = ObjectStore.queryByYonQL(releasePlanListSql);
                if (releaseItemsChild.length > 0) {
                  releasePlanRes[0].releaseOrderChild = releaseItemsChild;
                }
                releasePlan.push(releasePlanRes[0]);
              } else {
                continue;
              }
            }
          }
        }
      }
    }
    if (releasePlan.length > 0) {
      return { releasePlan };
    } else {
      throw new Error("该物料没有对应的放行方案");
    }
  }
}
exports({ entryPoint: MyAPIHandler });