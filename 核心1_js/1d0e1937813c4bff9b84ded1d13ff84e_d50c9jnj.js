let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    let X_HW_ID = config.BASE.X_HW_ID;
    let X_HW_APPKEY = config.BASE.X_HW_APPKEY;
    let ORGANIZATION_ID = config.BASE.ORGANIZATION_ID;
    let SUPPLIER_CODE = config.BASE.SUPPLIER_CODE;
    let BIZ_MODEL = config.BASE.BIZ_MODEL;
    let LEVEL = config.BASE.LEVEL;
    let CALC_MODE_FLAG = config.BASE.CALC_MODE_FLAG;
    let QUERY_FORECAST_CLOUD_API_URL = config.BASE.URL + config.API_URL.QUERY_FORECAST_CLOUD;
    let body = {
      organizationId: ORGANIZATION_ID,
      supplierCode: SUPPLIER_CODE,
      itemCode: "",
      bizModel: BIZ_MODEL,
      buyerName: "",
      level: LEVEL,
      suppItemCode: "",
      calcModeFlag: CALC_MODE_FLAG,
      odmSupplierCode: ""
    };
    let header = {
      "X-HW-ID": X_HW_ID,
      "X-HW-APPKEY": X_HW_APPKEY,
      "Content-Type": "application/json"
    };
    let preResList = [];
    let responseJson = {};
    let totalPages = 1;
    let pageSize = 100;
    let curPage = 1;
    let logObj = [];
    try {
      // 按照分页请求S云预测
      while (totalPages >= curPage) {
        let url = QUERY_FORECAST_CLOUD_API_URL + "?suffix_path=/" + pageSize + "/" + curPage;
        let requestTime = getDate();
        let strRsp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
        // 日志对象构造
        let logObjDetail = {
          methodName: "queryForecastCloud",
          url: url,
          requestParams: JSON.stringify(body),
          respResult: strRsp,
          requestTime: requestTime,
          respTime: getDate(),
          operationType: "query"
        };
        logObj.push(logObjDetail);
        responseJson = JSON.parse(strRsp);
        if (responseJson.code == "200") {
          var pageVO = responseJson.resultPaged.pageVO;
          totalPages = pageVO.totalPages;
          curPage = pageVO.curPage + 1;
          pageSize = pageVO.pageSize;
          let pageResult = responseJson.resultPaged.result || [];
          preResList.push(...pageResult);
        } else {
          // 调用异常不再继续请求
          totalPages = 0;
        }
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      try {
        ObjectStore.insertBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
      } catch (e) {
        // 日志写入报错，不做任何处理
        console.log("queryForecastCloud接口查询日志写入异常");
      }
    }
    let resList = [];
    if (preResList != null && preResList.length > 0) {
      // 过滤非101预测、100采购 数据
      let resFilterList = preResList.filter((item) => item.dataType == "100" || item.dataType == "101");
      resList.push(...resFilterList);
    }
    let resMap = {};
    resList.forEach((item) => {
      let key = item.issueDate + "#" + item.headId;
      if (resMap[key]) {
        resMap[key].push(item);
      } else {
        resMap[key] = [item];
      }
    });
    //根据接口请求结果构建返回信息
    let retData = {
      code: responseJson.code,
      success: responseJson.success,
      message: responseJson.errorMessage || responseJson.message || "",
      data: resMap
    };
    return retData;
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
Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() + 8, //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  // 根据y的长度来截取年
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }
  return fmt;
};
exports({
  entryPoint: MyTrigger
});