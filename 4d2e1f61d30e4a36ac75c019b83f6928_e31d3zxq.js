let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let resRsIds = []; //获取id
    for (let cgi = 0; cgi < request.cgddList.length; cgi++) {
      resRsIds.push(request.cgddList[cgi].id);
    }
    let sql = "select up_id,  up_code,   rt_msg,    rt_state,  up_type, id,createTime  from  GT22176AT10.GT22176AT10.sy01_push_wms_rt where up_id in (" + resRsIds + ") order by createTime DESC";
    var resFileRs = ObjectStore.queryByYonQL(sql, "sy01");
    if (resFileRs.length === 0 || typeof resFileRs == "undefined" || null === resFileRs) {
      return { request };
    } else {
      for (let i = 0; i < request.cgddList.length; i++) {
        for (let rti = 0; rti < resFileRs.length; rti++) {
          if (request.cgddList[i].id === resFileRs[rti].up_id) {
            request.cgddList[i]["item1144ac"] = resFileRs[rti].rt_state;
            request.cgddList[i]["item1147hb"] = resFileRs[rti].rt_msg;
            break;
          }
        }
      }
    }
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });