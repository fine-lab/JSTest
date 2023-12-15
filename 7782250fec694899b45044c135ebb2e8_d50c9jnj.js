let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let requestData = request.data;
    if (!requestData || requestData.length == 0) {
      throw new Error("请正确输入参数！");
    }
    let sconfigFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let sconfig = sconfigFunc.execute();
    let orderChangeIds = [];
    let orderChangeMap = new Map();
    requestData.forEach((item) => {
      orderChangeIds.push(item.orderChangeId + "");
      orderChangeMap.set(item.orderChangeId + "", item);
      // 拼推送给S相关字段
      item.vendorCode = sconfig.BASE.SUPPLIER_CODE;
    });
    let searchSql = "select id,orderChangeId from GT37595AT2.GT37595AT2.orderChangeInstructFinal where orderChangeId in ('" + orderChangeIds.join("','") + "')";
    let searchRes = ObjectStore.queryByYonQL(searchSql);
    if (!searchRes || searchRes.length == 0) {
      throw new Error("orderChangeId不存在！请检查！");
    }
    for (let i = 0; i < searchRes.length; i++) {
      let requestItem = orderChangeMap.get(searchRes[i].orderChangeId + "");
      searchRes[i].changeReceivedTime = requestItem.changeReceivedTime.split(" ")[0];
      searchRes[i].changeClosedTime = requestItem.changeClosedTime;
      searchRes[i].description = requestItem.description;
      searchRes[i].integrateStatus = "4"; // 状态更新为：已回复S
      delete searchRes[i].orderChangeId;
    }
    let postUrl = sconfig.BASE.URL + "/api/service/esupplier/updateOrderChangeBatch/1.0.0";
    let exeSRequestDate = getDate();
    let header = { "Content-Type": "application/json", "X-HW-ID": sconfig.BASE.X_HW_ID, "X-HW-APPKEY": sconfig.BASE.X_HW_APPKEY };
    let apiResponse = postman("post", postUrl, JSON.stringify(header), JSON.stringify(requestData));
    let exeSResponseDate = getDate();
    // 记录日志
    try {
      let logObj = {
        methodName: "updateOrderChangeBatch",
        requestParams: JSON.stringify(requestData),
        requestTime: exeSRequestDate,
        respResult: apiResponse,
        respTime: exeSResponseDate,
        url: postUrl
      };
      var resLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
    } catch (e) {}
    let responseData = JSON.parse(apiResponse);
    if (responseData.errorCode == "S") {
      ObjectStore.updateBatch("GT37595AT2.GT37595AT2.orderChangeInstructFinal", searchRes, "yb93f23c80");
    } else {
      // 推送失败回写状态，方便后面手工推送
      searchRes.forEach((updateItem) => {
        updateItem.integrateStatus = "3"; // 推送S失败，状态改为供应商已回复
      });
      ObjectStore.updateBatch("GT37595AT2.GT37595AT2.orderChangeInstructFinal", searchRes, "yb93f23c80");
    }
    let resultData = {};
    resultData["code"] = "200";
    resultData["message"] = "供应商回复变更指令数据成功";
    return resultData;
    function getDate(nowDate) {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      if (!nowDate) {
        nowDate = new Date().getTime();
      } else {
        if (nowDate.indexOf("-") > -1) {
          let date = new Date(nowDate);
          nowDate = date.getTime();
        }
      }
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