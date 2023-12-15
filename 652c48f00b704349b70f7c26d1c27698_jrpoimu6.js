let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    let retData = {
      status: "success",
      message: "无数据需下推供应商"
    };
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    let HT_TOKEN = config.BASE.HT_TOKEN;
    let CREATE_ATP_API_URL = config.BASE.HT_URL + config.API_URL.CREATE_ATP;
    let timestamp = Date.parse(new Date());
    let ciphertext = SHA256Encode(timestamp + HT_TOKEN);
    let pushList = [];
    let ids = [];
    let data = context;
    let sdSet = new Set();
    data.forEach((item) => {
      if (item.suppItemCode) {
        // 需求预测明细
        let itemDetails = item.demandForecastDetailList || [];
        itemDetails = itemDetails.filter((dd) => dd.dataType == "1");
        let itemDetail = itemDetails.length > 0 ? itemDetails[0] : {};
        ids.push(item.id);
        let pushObject = {
          ID: item.id,
          SOURCE_LINE_ID: item.id,
          S_PERIOD: item.issueDate,
          DOMESTIC_OVERSEA: item.regionType,
          S_PRODUCT_CATEGORY: item.partSort,
          S_SERVERS_CATEGORY: item.sServiceType,
          SSHL_ITEM_CODE: item.suppItemCode,
          SSHL_ITEM_DESC: item.suppItemDesc,
          SSHL_ITEM_STATUS: "",
          SUPPLY_MODE: item.supplierModel,
          SL_VENDOR_NAME: item.supplierName,
          SL_VENDOR_CODE: item.supplierCode,
          ODM_NAME: item.odmSupplierName,
          ODM_CODE: item.odmSupplierCode,
          WEEK1: itemDetail.week1,
          WEEK2: itemDetail.week2,
          WEEK3: itemDetail.week3,
          WEEK4: itemDetail.week4,
          WEEK5: itemDetail.week5,
          WEEK6: itemDetail.week6,
          WEEK7: itemDetail.week7,
          WEEK8: itemDetail.week8,
          WEEK9: itemDetail.week9,
          WEEK10: itemDetail.week10,
          WEEK11: itemDetail.week11,
          WEEK12: itemDetail.week12,
          WEEK13: itemDetail.week13,
          WEEK14: itemDetail.week14,
          WEEK15: itemDetail.week15,
          WEEK16: itemDetail.week16,
          WEEK17: itemDetail.week17,
          WEEK18: itemDetail.week18,
          WEEK19: itemDetail.week19,
          WEEK20: itemDetail.week20,
          WEEK21: itemDetail.week21,
          WEEK22: itemDetail.week22,
          WEEK23: itemDetail.week23,
          WEEK24: itemDetail.week24,
          WEEK25: itemDetail.week25,
          WEEK26: itemDetail.week26,
          WEEK27: itemDetail.week27,
          WEEK28: itemDetail.week28,
          WEEK29: itemDetail.week29,
          WEEK30: itemDetail.week30,
          WEEK31: itemDetail.week31,
          WEEK32: itemDetail.week32,
          WEEK33: itemDetail.week33,
          WEEK34: itemDetail.week34,
          WEEK35: itemDetail.week35,
          WEEK36: itemDetail.week36,
          WEEK37: itemDetail.week37,
          WEEK38: itemDetail.week38,
          WEEK39: itemDetail.week39,
          WEEK40: itemDetail.week40,
          WEEK41: itemDetail.week41,
          WEEK42: itemDetail.week42,
          WEEK43: itemDetail.week43,
          WEEK44: itemDetail.week44,
          WEEK45: itemDetail.week45,
          WEEK46: itemDetail.week46,
          WEEK47: itemDetail.week47,
          WEEK48: itemDetail.week48,
          WEEK49: itemDetail.week49,
          WEEK50: itemDetail.week50,
          WEEK51: itemDetail.week51,
          WEEK52: itemDetail.week52
        };
        pushList.push(pushObject);
      } else {
        sdSet.add(item.issueDate);
      }
    });
    for (var i = pushList.length - 1; i >= 0; i--) {
      for (let j of sdSet) {
        if (pushList[i].S_PERIOD == j) {
          pushList.splice(i, 1);
        }
      }
    }
    if (pushList.length == 0) {
      return retData;
    }
    let pushDataList = [];
    for (var j = 0; j < pushList.length; j++) {
      pushDataList.push(pushList[j]);
      delete pushList[j].ID;
    }
    let body = {
      Source_Channel: config.BASE.HT_SOURCE_CHANNEL,
      DATA: pushList
    };
    let header = {};
    if (config.BASE.SEND_CODE == "LX") {
      let authInfo = config.AUTH_INFO.USER + ":" + config.AUTH_INFO.KEY;
      let authorization = "Basic " + Base64Encode(authInfo);
      header = {
        timestamp: timestamp,
        Authorization: authorization,
        "Content-Type": "application/json"
      };
    } else {
      let ciphertext = SHA256Encode(timestamp + HT_TOKEN);
      header = {
        timestamp: timestamp,
        ciphertext: ciphertext,
        "Content-Type": "application/json"
      };
    }
    let logObjDetail = {};
    let strResponse = "{}";
    try {
      // 日志对象构造
      logObjDetail = {
        methodName: "createATP",
        url: CREATE_ATP_API_URL,
        requestParams: JSON.stringify(body),
        requestTime: getDate(),
        operationType: "insert"
      };
      strResponse = postman("post", CREATE_ATP_API_URL, JSON.stringify(header), JSON.stringify(body));
      logObjDetail.respTime = getDate();
      logObjDetail.respResult = strResponse;
    } catch (error) {
      throw new Error(error);
    } finally {
      try {
        ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObjDetail, "yb6b993e05");
      } catch (e) {
        // 日志写入报错，不做任何处理
        console.log("createATP接口查询日志写入异常");
      }
    }
    let responseJson = JSON.parse(strResponse);
    // 结果返回正确更新预测数据状态为已推送给供应商
    let updateObjects = [];
    ids.forEach((item) => {
      let updateObject = {
        id: item,
        dataStatus: "2"
      };
      updateObjects.push(updateObject);
    });
    var updateObjectRes = ObjectStore.updateBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast", updateObjects, "ybe05ef960");
    //根据接口请求结果构建返回信息
    retData = {
      status: responseJson.status,
      message: responseJson.message
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