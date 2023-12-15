let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func = extrequire("AT181E613C1770000A.configFun.configFun");
    let funcRes = func.execute();
    let pageSize = 10; // 每页条数
    let curPage = 1; // 当前页数
    let totalPageSize = 0; // 读取请求里的总页数
    let hwBody = { source: "esupplier" };
    let hwHeader = { "Content-Type": "application/json", "X-HW-ID": funcRes.CONFIG.API_HW_MSG.X_HW_ID, "X-HW-APPKEY": funcRes.CONFIG.API_HW_MSG.X_HW_APPKEY };
    for (var i = 0; i < curPage; i++) {
      let hwUrl = funcRes.CONFIG.API_HW_MSG.URL_DOMAIN + funcRes.CONFIG.API_HW_MSG.URL_RESERVOIROUT + "?suffix_path=/" + pageSize + "/" + (i + 1);
      let startDate = getDate();
      let hwResponse = postman("post", hwUrl, JSON.stringify(hwHeader), JSON.stringify(hwBody));
      let endDate = getDate();
      // 记录日志
      try {
        let logObj = { methodName: "saveOutFromS", requestParams: JSON.stringify(hwBody), requestTime: startDate, respResult: hwResponse, respTime: endDate, url: hwUrl };
        var resLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
      } catch (e) {}
      let hwRes = JSON.parse(hwResponse);
      if (hwRes.returnStatus != "S") {
        throw new Error("调取S接口失败！接口返回参数：" + hwResponse);
      }
      if (totalPageSize == 0 && hwRes.pagedResult.pageVO.totalPages > 1) {
        // 未读取过总页数
        totalPageSize = hwRes.pagedResult.pageVO.totalPages;
        curPage = totalPageSize;
      }
      let data = hwRes.pagedResult.result;
      if (data.length == 0) {
        return {};
      }
      let saveFunc = extrequire("AT181E613C1770000A.backFun.saveOutToYs");
      let saveRes = saveFunc.execute(null, { data: data });
    }
    return { status: 0 };
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
exports({ entryPoint: MyTrigger });