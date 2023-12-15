let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let querySql = " 	select taskDirectiveId,virtualItemCode,resItemCode,directiveType,directiveId,id, ";
    querySql += " detail.resPoNumber,detail.resQuantity,detail.resOrderTime,detail.batchNumber,detail.batchQty,detail.esdDate,detail.etaDate,detail.ataDate, ";
    querySql += " detail.asdDate,detail.resChannel,detail.stockerPn,detail.resPrePayTime,detail.resQuotationTime,detail.resPrePayQty,detail.resUsdPrice, ";
    querySql += " detail.resRate,detail.resCnyPrice,detail.resDcCode,detail.resCategoryName,detail.resPartNumber,detail.resManufacturers,detail.resPaymentTerms,detail.dataStatus,detail.id ";
    querySql += " from AT181E613C1770000A.AT181E613C1770000A.ReservoirIn ";
    querySql += " inner join AT181E613C1770000A.AT181E613C1770000A.ReservoirInDetail detail on detail.ReservoirInDetailFk = id ";
    querySql += " where stockerCode = 'LX' and detail.dataStatus = 2 limit 0, 400";
    let sendDatas = [];
    let updateDatas = [];
    let data = ObjectStore.queryByYonQL(querySql);
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let sendData = {};
        sendData.taskDirectiveId = data[i].taskDirectiveId;
        sendData.virtualItemCode = data[i].virtualItemCode;
        sendData.resItemCode = data[i].resItemCode;
        sendData.directiveType = data[i].directiveType;
        sendData.directiveId = data[i].directiveId;
        // 子表数据拼接
        sendData.resPoNumber = data[i].detail_resPoNumber;
        // 下单数量
        sendData.resQuantity = data[i].detail_resQuantity;
        // 下单时间
        if (data[i].detail_resOrderTime) {
          if (data[i].detail_resOrderTime.length > 10) {
            data[i].detail_resOrderTime = data[i].detail_resOrderTime.substring(0, 10);
          }
          sendData.resOrderTime = data[i].detail_resOrderTime;
        }
        //批次号
        sendData.batchNumber = data[i].detail_batchNumber;
        //批次数量
        sendData.batchQty = data[i].detail_batchQty;
        //预计发送日期
        sendData.esdDate = data[i].detail_esdDate;
        //预计到货日期
        sendData.etaDate = data[i].detail_etaDate;
        //实际到货日期
        sendData.ataDate = data[i].detail_ataDate;
        //实际发货日期
        sendData.asdDate = data[i].detail_asdDate;
        //渠道
        sendData.resChannel = data[i].detail_resChannel;
        //囤货商PN
        sendData.stockerPn = data[i].detail_stockerPn;
        //预付时间
        sendData.resPrePayTime = data[i].detail_resPrePayTime;
        //报价时间
        sendData.resQuotationTime = data[i].detail_resQuotationTime;
        //预付款数量
        sendData.resPrePayQty = data[i].detail_resPrePayQty;
        //单价(USD)
        sendData.resUsdPrice = data[i].detail_resUsdPrice;
        //汇率
        sendData.resRate = data[i].detail_resRate;
        //单价(CNY)
        sendData.resCnyPrice = data[i].detail_resCnyPrice;
        sendData.resDcCode = data[i].detail_resDcCode;
        //品名
        sendData.resCategoryName = data[i].detail_resCategoryName;
        //制造商型号
        sendData.resPartNumber = data[i].detail_resPartNumber;
        //制造商
        sendData.resManufacturers = data[i].detail_resManufacturers;
        //付款条件
        sendData.resPaymentTerms = data[i].detail_resPaymentTerms;
        sendDatas.push(sendData);
        // 更新数据推送状态
        let updateData = {};
        updateData.id = data[i].id;
        // 更改数据状态为已回复S
        updateData.ReservoirInDetailList = [{ id: data[i].detail_id, dataStatus: "3", _status: "Update" }];
        updateDatas.push(updateData);
      }
    }
    let func = extrequire("AT181E613C1770000A.configFun.configFun");
    let funcRes = func.execute();
    // 调用接口
    let hwHeader = { "Content-Type": "application/json", "X-HW-ID": funcRes.CONFIG.API_HW_MSG.X_HW_ID, "X-HW-APPKEY": funcRes.CONFIG.API_HW_MSG.X_HW_APPKEY };
    let hwUrl = funcRes.CONFIG.API_HW_MSG.URL_DOMAIN + funcRes.CONFIG.API_HW_MSG.URL_UPDATEIN;
    let startDate = getDate();
    let hwResponse = postman("post", hwUrl, JSON.stringify(hwHeader), JSON.stringify(sendDatas));
    let endDate = getDate();
    // 记录日志
    try {
      let logObj = { methodName: "synPushEsLX", requestParams: JSON.stringify(sendDatas), requestTime: startDate, respResult: hwResponse, respTime: endDate, url: hwUrl };
      var resLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
    } catch (e) {}
    let hwRes = JSON.parse(hwResponse);
    if (hwRes.returnStatus != "S") {
      return { status: "error", message: "调取S接口失败！失败原因：" + hwRes.returnMessage };
    }
    // 更新数据状态
    let updateRes = ObjectStore.updateBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirIn", updateDatas, "yba160dbe1");
    return { status: "success" };
    // 获取时间的函数
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