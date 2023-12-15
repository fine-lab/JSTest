let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //放行方案:
    let materialId = request.materialId;
    let orgId = request.orgId;
    let skuId = request.skuId;
    let businessType = request.businessType;
    let releasePlanData = [];
    let masterSql = "select * from ISY_2.ISY_2.release_plan_material where org_id = " + orgId + " and businessType like '" + businessType + "'";
    let masterRes = ObjectStore.queryByYonQL(masterSql);
    if (typeof masterRes != "undefined") {
      let proDetailList = [];
      if (masterRes.length > 0) {
        for (let i = 0; i < masterRes.length; i++) {
          if (typeof skuId != "undefined" && skuId != null) {
            if (typeof masterRes[i].skuCode != "undefined" && masterRes[i].skuCode != null) {
              if (masterRes[i].skuCode == skuId) {
                let releasePlanSql = "select * from 	ISY_2.ISY_2.release_plan where id=" + masterRes[i].releasePlan;
                let releasePlanRes = ObjectStore.queryByYonQL(releasePlanSql);
                let releasePlanChildSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk = " + masterRes[i].releasePlan;
                let releasePlanChildRes = ObjectStore.queryByYonQL(releasePlanChildSql);
                if (releasePlanChildRes.length > 0) {
                  releasePlanChildRes[0].release_items_childList = releasePlanChildRes;
                }
                proDetailList.push(releasePlanRes[0]);
              } else {
                continue;
              }
            } else if (typeof masterRes[i].materialCode != "undefined" && typeof masterRes[i].materialCode != null) {
              if (masterRes[i].materialCode == materialId) {
                let releasePlanSql = "select * from 	ISY_2.ISY_2.release_plan where id=" + masterRes[i].releasePlan;
                let releasePlanRes = ObjectStore.queryByYonQL(releasePlanSql);
                let releasePlanChildSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk = " + masterRes[i].releasePlan;
                let releasePlanChildRes = ObjectStore.queryByYonQL(releasePlanChildSql);
                if (releasePlanChildRes.length > 0) {
                  releasePlanChildRes[0].release_items_childList = releasePlanChildRes;
                }
                proDetailList.push(releasePlanRes[0]);
              } else {
                continue;
              }
            }
          } else if (typeof masterRes[i].materialCode != "undefined" && typeof masterRes[i].materialCode != null) {
            if (masterRes[i].materialCode == materialId) {
              let releasePlanSql = "select * from 	ISY_2.ISY_2.release_plan where id=" + masterRes[i].releasePlan;
              let releasePlanRes = ObjectStore.queryByYonQL(releasePlanSql);
              let releasePlanChildSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk = " + masterRes[i].releasePlan;
              let releasePlanChildRes = ObjectStore.queryByYonQL(releasePlanChildSql);
              if (releasePlanChildRes.length > 0) {
                releasePlanChildRes[0].release_items_childList = releasePlanChildRes;
              }
              proDetailList.push(releasePlanRes[0]);
            } else {
              continue;
            }
          }
          if (typeof masterRes[i].materialClassId != "undefined" && typeof proDetailList != "undefined" && proDetailList != null) {
            let proDetailInfoSql = "select * from pc.product.Product where id = " + materialId + " and manageClass = " + masterRes[i].materialClassId;
            let proDetailInfoList = ObjectStore.queryByYonQL(proDetailInfoSql, "productcenter");
            if (proDetailInfoList != null && proDetailInfoList.length > 0 && masterRes[i].materialClassId == proDetailInfoList[0].manageClass && materialId == proDetailInfoList[0].id) {
              let releasePlanSql = "select * from 	ISY_2.ISY_2.release_plan where id=" + masterRes[i].releasePlan;
              let releasePlanRes = ObjectStore.queryByYonQL(releasePlanSql);
              let releasePlanChildSql = "select * from ISY_2.ISY_2.release_items_child where release_items_childFk = " + masterRes[i].releasePlan;
              let releasePlanChildRes = ObjectStore.queryByYonQL(releasePlanChildSql);
              if (releasePlanChildRes.length > 0) {
                releasePlanChildRes[0].release_items_childList = releasePlanChildRes;
              }
              proDetailList.push(releasePlanRes[0]);
            } else {
              continue;
            }
          }
        }
        releasePlanData = proDetailList;
        if (typeof releasePlanData != "undefined" && releasePlanData != null) {
          if (releasePlanData.length > 0) {
            return { releasePlanData };
          } else {
            throw new Error("该物料没有对应的放行方案");
          }
        } else {
          throw new Error("该物料没有对应的放行方案");
        }
      }
    } else {
      releasePlanData = [];
      return { releasePlanData };
    }
  }
}
exports({ entryPoint: MyAPIHandler });