let AbstractAPIHandler = require("AbstractAPIHandler");
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
const sendToU8 = (voucherId) => {
  return { rst: true, msg: "success" };
};
const updateDB = (id, syncRst, syncFailure, syncReqt, syncResp) => {
  //更新数据库
  let syncTime = getNowDate();
  let paramsBody = {
    id: id,
    syncRst: syncRst,
    syncFailure: syncFailure,
    syncReqt: syncReqt,
    syncResp: syncResp,
    syncTime: syncTime
  };
  ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.voucherSync", paramsBody, "ybf4caba5e");
  return { rst: true, msg: "success" };
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var obj = JSON.parse(AppContext());
    var tid = obj.currentUser.tenantId;
    let voucherIds = request.voucherIds;
    let voucherIdList = voucherIds.split(",");
    for (var i in voucherIdList) {
      let id = voucherIdList[i];
      let vSyncCRst = ObjectStore.queryByYonQL("select voucherCode,displayName,locked from AT1703B12408A00002.AT1703B12408A00002.voucherSync where voucherId='" + id + "'", "developplatform");
      if (vSyncCRst.length > 0) {
        let vSyncObj = vSyncCRst[0];
        let locked = vSyncObj.locked;
        if (locked == undefined || locked == null || locked == 0) {
          return { rst: false, voucherCode: vSyncObj.voucherCode, displayName: vSyncObj.displayName };
        }
      }
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyAPIHandler });