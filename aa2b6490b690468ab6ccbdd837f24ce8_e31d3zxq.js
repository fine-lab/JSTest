let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let deliveryIds = request.deliveryIds;
    let selectReviewQl =
      "select id,sourcechild_id,fcheckhgqty,fcheckbhgqty,productDate,dtminvalidDate,batchNo,location,location.name locationName, qualifiedstate,qualifiedstate.statusName qualifiedstateStatusName,noqualifiedstate," +
      "noqualifiedstate.statusName from GT22176AT10.GT22176AT10.sy01_gspsalereturns where sourcechild_id in(";
    for (let i = 0; i < deliveryIds.length; i++) {
      selectReviewQl += "'" + deliveryIds[i] + "'";
      if (i != deliveryIds.length - 1) {
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
      if (!map[res[i].sourcechild_id].hasOwnProperty(res[i].id)) {
        map[res[i].sourcechild_id][res[i].id] = {};
      }
      map[res[i].sourcechild_id][res[i].id]["1"] = {
        batch: res[i].batchNo,
        produceDate: res[i].productDate,
        expireDate: res[i].dtminvalidDate,
        qty: res[i].fcheckhgqty,
        qualifiedstate: res[i].qualifiedstate,
        qualifiedstateStatusName: res[i].qualifiedstateStatusName,
        noqualifiedstate: res[i].noqualifiedstate,
        noqualifiedstateStatusName: res[i].noqualifiedstateStatusName,
        location: res[i].location,
        locationName: res[i].locationName
      };
      map[res[i].sourcechild_id][res[i].id]["2"] = {
        batch: res[i].batchNo,
        produceDate: res[i].productDate,
        expireDate: res[i].dtminvalidDate,
        qty: res[i].fcheckbhgqty == undefined ? 0 : res[i].fcheckbhgqty,
        qualifiedstate: res[i].qualifiedstate,
        qualifiedstateStatusName: res[i].qualifiedstateStatusName,
        noqualifiedstate: res[i].noqualifiedstate,
        noqualifiedstateStatusName: res[i].noqualifiedstateStatusName,
        location: res[i].location,
        locationName: res[i].locationName
      };
    }
    return {
      map: map
    };
  }
}
exports({ entryPoint: MyAPIHandler });