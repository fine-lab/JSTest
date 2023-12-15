let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let purChildId = request.purChildId;
    let purInId = request.purInId;
    if (purInId == undefined) {
      purInId = 0;
    }
    let materialList = [];
    //质检单数量
    let getQuareQty = function (sourcechild_id, isSame, isHG) {
      let qty = 0;
      let ySql =
        "select up_sourcechild_id,batchNo,fchgsl,fcbhgsl,noqualifiedstate,noqualifiedstateName,qualifiedstate,qualifiedstateName,noQualifiedResult from GT22176AT10.GT22176AT10.SY01_quareventryv1" +
        " where sourcechild_id = '" +
        sourcechild_id +
        "' and SY01_quareventryv1Fk.verifystate = '2'";
      let quareRes = ObjectStore.queryByYonQL(ySql, "sy01");
      for (let i = 0; i < quareRes.length; i++) {
        if (isSame) {
          //可出库
          if (quareRes[i].noQualifiedResult == 1) {
            qty += (isNaN(quareRes[i].fchgsl) ? 0 : quareRes[i].fchgsl) + (isNaN(quareRes[i].fcbhgsl) ? 0 : quareRes[i].fcbhgsl);
          } else {
            qty += isNaN(quareRes[i].fchgsl) ? 0 : quareRes[i].fchgsl;
          }
        } else {
          if (isHG) {
            qty += isNaN(quareRes[i].fchgsl) ? 0 : quareRes[i].fchgsl;
          } else {
            if (quareRes[i].noQualifiedResult == 1) {
              qty += isNaN(quareRes[i].fcbhgsl) ? 0 : quareRes[i].fcbhgsl;
            }
          }
        }
      }
      return qty;
    };
    let createMaterialInfo = function (materialInfo, sourceIdProperty, batchProperty, stateProperty, stateIdProperty, qtyProperty, unqtyProperty, isSame, isHG) {
      let ishave = false;
      let qty = 0;
      let quareQty = getQuareQty(materialInfo.id, isSame, isHG);
      if (isSame) {
        qty = (isNaN(materialInfo[qtyProperty]) ? 0 : materialInfo[qtyProperty]) + (isNaN(materialInfo[unqtyProperty]) ? 0 : materialInfo[unqtyProperty]);
      } else {
        if (isHG) {
          qty = isNaN(materialInfo[qtyProperty]) ? 0 : materialInfo[qtyProperty];
        } else {
          qty = isNaN(materialInfo[unqtyProperty]) ? 0 : materialInfo[unqtyProperty];
        }
      }
      qty += quareQty;
      for (let i = 0; i < materialList.length; i++) {
        if (materialInfo[batchProperty] == materialList[i].batch_no && materialInfo[stateProperty] == materialList[i].storeState && materialInfo[sourceIdProperty] == materialList[i].sourcechild_id) {
          materialList[i].qty += qty;
          ishave = true;
        }
      }
      if (!ishave) {
        let newMaterialInfo = {};
        let purInQty = 0;
        let ysql = "";
        newMaterialInfo.sourcechild_id = materialInfo[sourceIdProperty];
        newMaterialInfo.batch_no = materialInfo[batchProperty];
        newMaterialInfo.storeStateId = materialInfo[stateIdProperty];
        newMaterialInfo.storeState = materialInfo[stateProperty];
        //当前已经出库的数量
        if (newMaterialInfo.batch_no == undefined) {
          ysql =
            "select qty from st.purinrecord.PurInRecords " +
            " where purchaseOrderSourceDetailId = '" +
            newMaterialInfo.sourcechild_id +
            "' and batchno is null and mainid != '" +
            purInId +
            "' and stockStatusDoc = '" +
            newMaterialInfo.storeStateId +
            "'";
        } else {
          ysql =
            "select qty from st.purinrecord.PurInRecords " +
            " where purchaseOrderSourceDetailId = '" +
            newMaterialInfo.sourcechild_id +
            "' and batchno = '" +
            newMaterialInfo.batch_no +
            "' and mainid != '" +
            purInId +
            "' and stockStatusDoc = '" +
            newMaterialInfo.storeStateId +
            "'";
        }
        let purInRes = ObjectStore.queryByYonQL(ysql, "sy01");
        for (let i = 0; i < purInRes.length; i++) {
          purInQty += purInRes[i].qty;
        }
        newMaterialInfo.qty = -qty - purInQty;
        materialList.push(newMaterialInfo);
      }
    };
    //购进退出复核
    let ySql =
      "select sourcechild_id,id,batchID,batch_no,qualifie_qty,unqualifie_qty,noqualifiedstate,noqualifiedstateName,qualifiedstate,qualifiedstateName,noQualifedResult from GT22176AT10.GT22176AT10.SY01_gjtcfh_l" +
      " where sourcechild_id = '" +
      purChildId +
      "' and SY01_puroutreviewv2_id.verifystate = '2'";
    let purOutRes = ObjectStore.queryByYonQL(ySql, "sy01");
    for (let i = 0; i < purOutRes.length; i++) {
      if (purOutRes[i].noQualifedResult == 1) {
        //判断合格库存状态和不合格库存状态是否类型一致
        if (purOutRes[i].noqualifiedstate != purOutRes[i].qualifiedstate) {
          createMaterialInfo(purOutRes[i], "sourcechild_id", "batch_no", "qualifiedstateName", "qualifiedstate", "qualifie_qty", "unqualifie_qty", false, true);
          createMaterialInfo(purOutRes[i], "sourcechild_id", "batch_no", "noqualifiedstateName", "noqualifiedstate", "qualifie_qty", "unqualifie_qty", false, false);
        } else {
          createMaterialInfo(purOutRes[i], "sourcechild_id", "batch_no", "qualifiedstateName", "qualifiedstate", "qualifie_qty", "unqualifie_qty", true, true);
        }
      } else {
        createMaterialInfo(purOutRes[i], "sourcechild_id", "batch_no", "qualifiedstateName", "qualifiedstate", "qualifie_qty", "unqualifie_qty", false, true);
      }
      //质量复查
    }
    return {
      materialList: materialList
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});