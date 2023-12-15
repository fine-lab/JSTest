let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询购进入库验收单、质量复查单
    let purIds = request.purIds;
    let selectReviewQl =
      "select id,sourcechild_id,batch_no,manufact_date,valid_until,qualifie_qty,quaInState,quaInStateName,unqualifie_qty,unquaDealType,unQuaNeedInQty,unQuaInState,unQuaInStateName,uncertain_qty from " +
      "GT22176AT10.GT22176AT10.SY01_purinstockys_l where sourcechild_id in (";
    for (let i = 0; i < purIds.length; i++) {
      selectReviewQl += "'" + purIds[i] + "'";
      if (i != purIds.length - 1) {
        selectReviewQl += ",";
      }
    }
    selectReviewQl += ")";
    let res = ObjectStore.queryByYonQL(selectReviewQl, "sy01");
    //被减map
    let map = {};
    for (let i = 0; i < res.length; i++) {
      if (!map.hasOwnProperty(res[i].sourcechild_id)) {
        map[res[i].sourcechild_id] = {};
        map[res[i].sourcechild_id][res[i].id] = {};
        //合格来源
      }
      map[res[i].sourcechild_id][res[i].id]["1"] = {
        batch: res[i].batch_no,
        produceDate: res[i].manufact_date,
        expireDate: res[i].valid_until,
        qty: res[i].qualifie_qty,
        stockState: res[i].quaInState,
        stockStateName: res[i].quaInStateName
      };
      if (res[i].unQuaNeedInQty != undefined && res[i].unQuaNeedInQty > 0) {
        map[res[i].sourcechild_id][res[i].id]["2"] = {
          batch: res[i].batch_no,
          produceDate: res[i].manufact_date,
          expireDate: res[i].valid_until,
          qty: res[i].unQuaNeedInQty,
          stockState: res[i].unQuaInState,
          stockStateName: res[i].unQuaInStateName
        };
      }
      //如果有复查数量，去查询质量复查单，将数量相加
      if (res[i].uncertain_qty != undefined && res[i].uncertain_qty > 0) {
        let selectReCheckwQl =
          "select id,code,sourcechild_id,fchgsl,qualifiedstate,qualifiedstateName,fcbhgsl,noQualifiedResult,noQuaNeedInQty,noqualifiedstate,noqualifiedstateName " +
          "from GT22176AT10.GT22176AT10.SY01_quareventryv1  where sourcechild_id = '" +
          res[i].id +
          "'";
        let reCheckRes = ObjectStore.queryByYonQL(selectReCheckwQl, "sy01");
        if (reCheckRes.length > 1) {
          throw new Error("质量复查出现拆行，暂不支持，单号：" + reCheckRes[0].code);
        } else {
          map[res[i].sourcechild_id][res[i].id]["1"]["qty"] += reCheckRes[0].fchgsl;
          if (reCheckRes[0].fchgsl.noQuaNeedInQty != undefined && reCheckRes[0].fchgsl.noQuaNeedInQty > 0) {
            map[res[i].sourcechild_id][res[i].id]["1"]["qty"] += reCheckRes[0].noQuaNeedInQty;
          }
        }
      }
    }
    //查询所有其他的采购入库单
    let selectPurInQl = "select sourceautoid,extendCheckId,extendEntrySource,qty from st.purinrecord.PurInRecords where sourceautoid in(";
    for (let i = 0; i < purIds.length; i++) {
      selectPurInQl += "'" + purIds[i] + "'";
      if (i != purIds.length - 1) {
        selectPurInQl += ",";
      }
    }
    selectPurInQl += ") and id != '" + request.id + "'";
    let purInRes = ObjectStore.queryByYonQL(selectPurInQl, "ustock");
    let purMap = {};
    for (let i = 0; i < purInRes.length; i++) {
      if (!purMap.hasOwnProperty(purInRes[i].sourceautoid)) {
        purMap[purInRes[i].sourceautoid] = {};
        purMap[purInRes[i].sourceautoid][purInRes[i][extendCheckId]] = {};
        purMap[purInRes[i].sourceautoid][purInRes[i][extendCheckId]]["1"] = 0;
        purMap[purInRes[i].sourceautoid][purInRes[i][extendCheckId]]["2"] = 0;
      } else if (!purMap[purInRes[i].sourceautoid].hasOwnProperty(purInRes[i][extendCheckId])) {
        purMap[purInRes[i].sourceautoid][purInRes[i][extendCheckId]] = {};
        purMap[purInRes[i].sourceautoid][purInRes[i][extendCheckId]]["1"] = 0;
        purMap[purInRes[i].sourceautoid][purInRes[i][extendCheckId]]["2"] = 0;
      }
      if (purInRes[i].extendEntrySource != undefined && purInRes[i].extendEntrySource == 1) {
        purMap[purInRes[i].sourceautoid][purInRes[i][extendCheckId]]["1"] += purInRes[i].qty;
      } else if (purInRes[i].extendEntrySource != undefined && purInRes[i].extendEntrySource == 2) {
        purMap[purInRes[i].sourceautoid][purInRes[i][extendCheckId]]["2"] += purInRes[i].qty;
      }
    }
    //相减逻辑,循环被减值，map中一定有，无须判断是否存在
    for (let purIdKey in purMap) {
      for (let reviewId in purMap[purIdKey]) {
        for (let sourceTypeKey in purMap[purIdKey][reviewId]) {
          map[purIdKey][reviewId][sourceTypeKey]["qty"] -= purMap[purIdKey][reviewId][sourceTypeKey];
        }
      }
    }
    return { map: map };
  }
}
exports({ entryPoint: MyAPIHandler });