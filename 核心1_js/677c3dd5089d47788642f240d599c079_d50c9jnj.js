let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    let sendDatas = [];
    let updateDatas = [];
    let updateIdMap = new Map();
    for (let i = 0; i < data.length; i++) {
      let sendData = {};
      sendData.taskDirectiveId = data[i].taskDirectiveId;
      sendData.outboundQty = data[i].ReservoirOutDetailList_outCount;
      if (data[i].ReservoirOutDetailList_outDate) {
        if (data[i].ReservoirOutDetailList_outDate.length > 10) {
          data[i].ReservoirOutDetailList_outDate = data[i].ReservoirOutDetailList_outDate.substring(0, 10);
        }
        sendData.outboundTime = data[i].ReservoirOutDetailList_outDate.replace(/\//g, "-");
      }
      if (!data[i].ReservoirOutDetailList_batchNumber) {
        return { status: "error", message: "批次号不能为空！" };
      }
      sendData.batchNumber = data[i].ReservoirOutDetailList_batchNumber.trim();
      sendDatas.push(sendData);
      if (!updateIdMap.has(data[i].id)) {
        updateIdMap.set(data[i].id, [{ id: data[i].ReservoirOutDetailList_id, dataStatus: "3", _status: "Update" }]);
      } else {
        let detailList = updateIdMap.get(data[i].id);
        detailList.push({ id: data[i].ReservoirOutDetailList_id, dataStatus: "3", _status: "Update" });
        updateIdMap.set(data[i].id, detailList);
      }
    }
    let func = extrequire("AT181E613C1770000A.configFun.configFun");
    let funcRes = func.execute();
    let hwHeader = { "Content-Type": "application/json", "X-HW-ID": funcRes.CONFIG.API_HW_MSG.X_HW_ID, "X-HW-APPKEY": funcRes.CONFIG.API_HW_MSG.X_HW_APPKEY };
    let hwUrl = funcRes.CONFIG.API_HW_MSG.URL_DOMAIN + funcRes.CONFIG.API_HW_MSG.URL_UPDATEOUT;
    let startDate = getDate();
    let hwResponse = postman("post", hwUrl, JSON.stringify(hwHeader), JSON.stringify(sendDatas));
    let endDate = getDate();
    // 记录日志
    try {
      let logObj = { methodName: "updateOutToS", requestParams: JSON.stringify(sendDatas), requestTime: startDate, respResult: hwResponse, respTime: endDate, url: hwUrl };
      var resLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
    } catch (e) {}
    let hwRes = JSON.parse(hwResponse);
    if (hwRes.returnStatus != "S") {
      return { status: "error", message: "调取S接口失败！失败原因：" + hwRes.returnMessage };
    }
    updateIdMap.forEach((value, key) => {
      let updateData = {};
      updateData.id = key;
      updateData.ReservoirOutDetailList = value;
      updateDatas.push(updateData);
    });
    let updateRes = ObjectStore.updateBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirOut", updateDatas, "yb97e9b3a5");
    return { status: "success" };
    function getDate() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      var timeStr = date.getFullYear() + "-";
      if (date.getMonth() < 9) {
        // 月份从0开始的
        timeStr += "0";
      }
      timeStr += date.getMonth() + 1 + "-";
      timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      timeStr += " ";
      timeStr += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      timeStr += ":";
      timeStr += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      timeStr += ":";
      timeStr += date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return timeStr;
    }
  }
}
exports({ entryPoint: MyAPIHandler });