let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourceEntryIds = request.sourceEntryIds;
    //查询其他的其他出库单（考虑一对多情况）
    let yonql1 = "select qty,sourceautoid from st.othoutrecord.OthOutRecords where sourceautoid in (" + sourceEntryIds.join(",") + ")";
    let res1 = ObjectStore.queryByYonQL(yonql1, "ustock");
    let otherInfo = {};
    for (let i = 0; i < res1.length; i++) {
      if (!otherInfo.hasOwnProperty(res1[i].sourceautoid)) {
        otherInfo[res1[i].sourceautoid] = 0;
      }
      otherInfo[res1[i].sourceautoid] += res1[i].qty;
    }
    //查询报损单据的数量
    let yonql2 = "select id,applications_number from GT22176AT10.GT22176AT10.SY01_pro_sreport_v3 where id in (" + sourceEntryIds.join(",") + ")";
    let res2 = ObjectStore.queryByYonQL(yonql2, "sy02");
    let info = {};
    for (let i = 0; i < res2.length; i++) {
      if (!info.hasOwnProperty(res2[i].id)) {
        info[res2[i].id] = res2[i].applications_number;
      }
      if (otherInfo.hasOwnProperty(res2[i].id)) {
        info[res2[i].id] = info[res2[i].id] - otherInfo[res2[i].id];
      }
    }
    return { info: info };
  }
}
exports({ entryPoint: MyAPIHandler });