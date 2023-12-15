let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ids = request.ids;
    let sql =
      "select id,sourcechild_id,checkNum,checkQualifiedNum,checkUnqualifiedNum,mrfDate,validityTo,batchNo,location,location.name from GT22176AT10.GT22176AT10.SY01_xsckfmx_v6" +
      " where sourcechild_id in (";
    for (let i = 0; i < ids.length; i++) {
      sql += "'" + ids[i] + "'";
      if (i != ids.length - 1) {
        sql += ",";
      }
    }
    sql += ")";
    let res = ObjectStore.queryByYonQL(sql);
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
        batchNo: res[i].batchNo,
        mrfDate: res[i].mrfDate,
        validityTo: res[i].validityTo,
        checkNum: res[i].checkNum,
        checkQualifiedNum: res[i].checkQualifiedNum,
        checkUnqualifiedNum: res[i].checkUnqualifiedNum,
        location: res[i].location,
        locationName: res[i].locationName
      };
      map[res[i].sourcechild_id][res[i].id]["2"] = {
        batchNo: res[i].batchNo,
        mrfDate: res[i].mrfDate,
        validityTo: res[i].validityTo,
        checkNum: res[i].checkNum == undefined ? 0 : res[i].checkNum,
        checkQualifiedNum: res[i].checkQualifiedNum == undefined ? 0 : res[i].checkQualifiedNum,
        checkUnqualifiedNum: res[i].checkUnqualifiedNum == undefined ? 0 : res[i].checkUnqualifiedNum,
        location: res[i].location,
        locationName: res[i].locationName
      };
    }
    return { List: map };
  }
}
exports({ entryPoint: MyAPIHandler });