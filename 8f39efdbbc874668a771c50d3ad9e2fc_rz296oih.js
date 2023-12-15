let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    let retData = {
      message: "无数据需下推供应商"
    };
    let sdPeriodSet = new Set();
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        sdPeriodSet.add(data[i].issueDate);
      }
    }
    let sdPeriod = "";
    for (let i of sdPeriodSet) {
      sdPeriod += "'" + i + "',";
    }
    if (sdPeriod.length == 0) {
      throw new Error("未选中任何数据");
    }
    sdPeriod = sdPeriod.substring(0, sdPeriod.length - 1);
    let forecastSql =
      "select *, main.dataStatus as dataStatus,main.supplierName as supplierName,main.supplierCode as supplierCode, main.id as mainId, main.lineId as lineId, main.issueDate as issueDate, main.regionType as regionType, main.partSort as partSort, main.sServiceType as sServiceType, main.suppItemCode as suppItemCode, main.suppItemDesc as suppItemDesc, main.odmSupplierName as odmSupplierName, main.odmSupplierCode as odmSupplierCode,main.supplierModel as  supplierModel from 	AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecastDetail left join AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast main";
    forecastSql += " on main.id = demandForecast_id where main.issueDate in (" + sdPeriod + ")";
    let forecastRes = ObjectStore.queryByYonQL(forecastSql);
    let pushList = [];
    let ids = [];
    let sderrorSet = new Set();
    forecastRes = forecastRes.filter((dd) => dd.dataType == "1");
    if (forecastRes.length > 0) {
      forecastRes.forEach((item) => {
        if (item.suppItemCode) {
          ids.push(item.mainId);
          // 需求预测明细
          let pushObject = {
            ID: item.mainId,
            SOURCE_LINE_ID: item.mainId,
            S_PERIOD: item.issueDate,
            DOMESTIC_OVERSEA: item.regionType,
            S_PRODUCT_CATEGORY: item.partSort,
            S_SERVERS_CATEGORY: item.sServiceType,
            SSHL_ITEM_CODE: item.suppItemCode,
            SSHL_ITEM_DESC: item.suppItemDesc || " ",
            SSHL_ITEM_STATUS: " ",
            SUPPLY_MODE: item.supplierModel || " ",
            SL_VENDOR_NAME: item.supplierName || " ",
            SL_VENDOR_CODE: item.supplierCode,
            ODM_NAME: item.odmSupplierName || " ",
            ODM_CODE: item.odmSupplierCode,
            WEEK1: item.week1,
            WEEK2: item.week2,
            WEEK3: item.week3,
            WEEK4: item.week4,
            WEEK5: item.week5,
            WEEK6: item.week6,
            WEEK7: item.week7,
            WEEK8: item.week8,
            WEEK9: item.week9,
            WEEK10: item.week10,
            WEEK11: item.week11,
            WEEK12: item.week12,
            WEEK13: item.week13,
            WEEK14: item.week14,
            WEEK15: item.week15,
            WEEK16: item.week16,
            WEEK17: item.week17,
            WEEK18: item.week18,
            WEEK19: item.week19,
            WEEK20: item.week20,
            WEEK21: item.week21,
            WEEK22: item.week22,
            WEEK23: item.week23,
            WEEK24: item.week24,
            WEEK25: item.week25,
            WEEK26: item.week26,
            WEEK27: item.week27,
            WEEK28: item.week28,
            WEEK29: item.week29,
            WEEK30: item.week30,
            WEEK31: item.week31,
            WEEK32: item.week32,
            WEEK33: item.week33,
            WEEK34: item.week34,
            WEEK35: item.week35,
            WEEK36: item.week36,
            WEEK37: item.week37,
            WEEK38: item.week38,
            WEEK39: item.week39,
            WEEK40: item.week40,
            WEEK41: item.week41,
            WEEK42: item.week42,
            WEEK43: item.week43,
            WEEK44: item.week44,
            WEEK45: item.week45,
            WEEK46: item.week46,
            WEEK47: item.week47,
            WEEK48: item.week48,
            WEEK49: item.week49,
            WEEK50: item.week50,
            WEEK51: item.week51,
            WEEK52: item.week52
          };
          if (item.dataStatus == "1") {
            pushList.push(pushObject);
          }
        } else {
          sderrorSet.add(item.issueDate);
        }
      });
    }
    for (var i = pushList.length - 1; i >= 0; i--) {
      for (let j of sderrorSet) {
        if (pushList[i].S_PERIOD == j) {
          pushList.splice(i, 1);
        }
      }
    }
    if (pushList.length == 0 && sderrorSet.size > 0) {
      retData.message = "SD期次: " + JSON.stringify(Array.from(sderrorSet)) + " 有异常数据, 推送HT失败!";
      return retData;
    }
    if (pushList.length == 0) {
      return retData;
    }
    let pushDataList = [];
    for (var j = 0; j < pushList.length; j++) {
      pushDataList.push(pushList[j]);
      delete pushList[j].ID;
    }
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    let HT_TOKEN = config.BASE.HT_TOKEN;
    let CREATE_ATP_API_URL = config.BASE.HT_URL + config.API_URL.CREATE_ATP;
    let timestamp = Date.parse(new Date());
    let body = {
      Source_Channel: "SS",
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
    //根据接口请求结果构建返回信息
    retData = {
      status: responseJson.status,
      message: responseJson.message
    };
    if (sdPeriodSet.size > sderrorSet.size && sderrorSet.size > 0) {
      let differenceSet = new Set([...sdPeriodSet].filter((x) => !sderrorSet.has(x)));
      retData.message = "SD期次: " + JSON.stringify(Array.from(differenceSet)) + " 有异常数据, 推送HT失败!";
    }
    ids.forEach((item) => {
      let updateObject = {
        id: item,
        dataStatus: "2",
        errorDesc: ""
      };
      updateObjects.push(updateObject);
    });
    if (responseJson.status == "success") {
      var updateObjectRes = ObjectStore.updateBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast", updateObjects, "ybe05ef960");
    }
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
exports({ entryPoint: MyAPIHandler });