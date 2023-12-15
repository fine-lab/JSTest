let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let idArray = request.ids;
    //查询报损数据
    let yonql1 =
      "select SY01_pro_uselessv3_id,SY01_pro_uselessv3_id.code code ,id,applications_number from GT22176AT10.GT22176AT10.SY01_pro_sreport_v3 where SY01_pro_uselessv3_id in (" +
      idArray.join(",") +
      ")";
    let res = ObjectStore.queryByYonQL(yonql1, "sy01");
    let report = {};
    for (let i = 0; i < res.length; i++) {
      if (!report.hasOwnProperty(res[i].SY01_pro_uselessv3_id)) {
        report[res[i].SY01_pro_uselessv3_id] = [];
      }
      report[res[i].SY01_pro_uselessv3_id].push({ code: res[i].code, entryId: res[i].id, qty: res[i].applications_number });
    }
    //查询其他出库信息
    let yonql2 = "select qty,sourceautoid from st.othoutrecord.OthOutRecords  where sourceid in (" + idArray.join(",") + ")";
    let res2 = ObjectStore.queryByYonQL(yonql2, "ustock");
    let otherInfo = {};
    for (let i = 0; i < res2.length; i++) {
      if (!otherInfo.hasOwnProperty(res2[i].sourceautoid)) {
        otherInfo[res2[i].sourceautoid] = 0;
      }
      otherInfo[res2[i].sourceautoid] += res2[i].qty;
    }
    let message = "";
    for (let key in report) {
      let entrys = report[key];
      let flag = false;
      for (let j = 0; j < entrys.length; j++) {
        if (!otherInfo.hasOwnProperty(entrys[j].entryId) || otherInfo[entrys[j].entryId] < entrys[j].qty) {
          flag = true;
          break;
        }
      }
      if (flag == false) {
        message += "单号：" + entrys[0].code + "无可下推数量\n";
      }
    }
    return { message: message };
  }
}
exports({ entryPoint: MyAPIHandler });