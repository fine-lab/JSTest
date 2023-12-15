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
      sendData.virtualItemCode = data[i].virtualItemCode;
      sendData.resItemCode = data[i].resItemCode;
      sendData.directiveType = data[i].directiveType;
      sendData.directiveId = data[i].directiveId;
      sendData.resPoNumber = data[i].ReservoirInDetailList_resPoNumber;
      //下单数量
      sendData.resQuantity = data[i].ReservoirInDetailList_resQuantity;
      //下单时间
      if (data[i].ReservoirInDetailList_resOrderTime) {
        if (data[i].ReservoirInDetailList_resOrderTime.length > 10) {
          data[i].ReservoirInDetailList_resOrderTime = data[i].ReservoirInDetailList_resOrderTime.substring(0, 10);
        }
        sendData.resOrderTime = data[i].ReservoirInDetailList_resOrderTime;
      }
      //批次号
      sendData.batchNumber = data[i].ReservoirInDetailList_batchNumber;
      //批次数量
      sendData.batchQty = data[i].ReservoirInDetailList_batchQty;
      //预计发送日期
      sendData.esdDate = data[i].ReservoirInDetailList_esdDate;
      //预计到货日期
      sendData.etaDate = data[i].ReservoirInDetailList_etaDate;
      //实际到货日期
      sendData.ataDate = data[i].ReservoirInDetailList_ataDate;
      //实际发货日期
      sendData.asdDate = data[i].ReservoirInDetailList_asdDate;
      //渠道
      sendData.resChannel = data[i].ReservoirInDetailList_resChannel;
      //囤货商PN
      sendData.stockerPn = data[i].ReservoirInDetailList_stockerPn;
      //预付时间
      sendData.resPrePayTime = data[i].ReservoirInDetailList_resPrePayTime;
      //报价时间
      sendData.resQuotationTime = data[i].ReservoirInDetailList_resQuotationTime;
      //预付款数量
      sendData.resPrePayQty = data[i].ReservoirInDetailList_resPrePayQty;
      //单价(USD)
      sendData.resUsdPrice = data[i].ReservoirInDetailList_resUsdPrice;
      //汇率
      sendData.resRate = data[i].ReservoirInDetailList_resRate;
      //单价(CNY)
      sendData.resCnyPrice = data[i].ReservoirInDetailList_resCnyPrice;
      sendData.resDcCode = data[i].ReservoirInDetailList_resDcCode;
      //品名
      sendData.resCategoryName = data[i].ReservoirInDetailList_resCategoryName;
      //制造商型号
      sendData.resPartNumber = data[i].ReservoirInDetailList_resPartNumber;
      //制造商
      sendData.resManufacturers = data[i].ReservoirInDetailList_resManufacturers;
      //付款条件
      sendData.resPaymentTerms = data[i].ReservoirInDetailList_resPaymentTerms;
      sendDatas.push(sendData);
      if (!updateIdMap.has(data[i].id)) {
        updateIdMap.set(data[i].id, [{ id: data[i].ReservoirInDetailList_id, dataStatus: "3", _status: "Update" }]);
      } else {
        let detailList = updateIdMap.get(data[i].id);
        detailList.push({ id: data[i].ReservoirInDetailList_id, dataStatus: "3", _status: "Update" });
        updateIdMap.set(data[i].id, detailList);
      }
      //更新数据推送状态
      // 更改数据状态为已回复S
    }
    let func = extrequire("AT181E613C1770000A.configFun.configFun");
    let funcRes = func.execute();
    //调用接口
    let hwHeader = { "Content-Type": "application/json", "X-HW-ID": funcRes.CONFIG.API_HW_MSG.X_HW_ID, "X-HW-APPKEY": funcRes.CONFIG.API_HW_MSG.X_HW_APPKEY };
    let hwUrl = funcRes.CONFIG.API_HW_MSG.URL_DOMAIN + funcRes.CONFIG.API_HW_MSG.URL_UPDATEIN;
    let startDate = getDate();
    let hwResponse = postman("post", hwUrl, JSON.stringify(hwHeader), JSON.stringify(sendDatas));
    let endDate = getDate();
    // 记录日志
    try {
      let logObj = { methodName: "updateInToS", requestParams: JSON.stringify(sendDatas), requestTime: startDate, respResult: hwResponse, respTime: endDate, url: hwUrl };
      var resLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
    } catch (e) {}
    let hwRes = JSON.parse(hwResponse);
    if (hwRes.returnStatus != "S") {
      return { status: "error", message: "调取S接口失败！失败原因：" + hwRes.returnMessage };
    }
    //更新数据状态
    updateIdMap.forEach((value, key) => {
      let updateData = {};
      updateData.id = key;
      updateData.ReservoirInDetailList = value;
      updateDatas.push(updateData);
    });
    let updateRes = ObjectStore.updateBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirIn", updateDatas, "yba160dbe1");
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