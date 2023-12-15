let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pushData = request.pushData;
    let retData = {};
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    //接收更新华为接口的预测数据id
    let updateHWIdSet = new Set();
    if (pushData.length > 0) {
      pushData.forEach((item) => {
        updateHWIdSet.add(item.id);
      });
    }
    let updateHWIds = Array.from(updateHWIdSet);
    //调华为接口将供应数据传给华为
    //查询供应商回复的所有数据
    let updateHWIdList = "";
    if (updateHWIds.length > 0) {
      for (var i = 0; i < updateHWIds.length; i++) {
        updateHWIdList += "'" + updateHWIds[i] + "',";
      }
    }
    if (updateHWIds) {
      updateHWIdList = updateHWIdList.substring(0, updateHWIdList.length - 1);
      let updateHWsql =
        "select main.id as id, id as detailId, demandForecast_id as demandForecast_id , dataType as dataType , main.lineId as lineId , main.issueDate as issueDate , main.organizationId as organizationId , main.itemCode as itemCode , main.supplierCode as supplierCode, main.odmSupplierCode as odmSupplierCode, dataType as dataType, " +
        " day1 as day1,     " +
        " day2 as day2,     " +
        " day3 as day3,     " +
        " day4 as day4,     " +
        " day5 as day5,     " +
        " day6 as day6,     " +
        " day7 as day7,     " +
        " day8 as day8,     " +
        " day9 as day9,     " +
        " day10  as day10,  " +
        " day11  as day11,  " +
        " day12  as day12,  " +
        " day13  as day13,  " +
        " day14  as day14,  " +
        " day15  as day15,  " +
        " day16  as day16,  " +
        " day17  as day17,  " +
        " day18  as day18,  " +
        " day19  as day19,  " +
        " day20  as day20,  " +
        " day21  as day21,  " +
        " week1  as week1,  " +
        " week2  as week2,  " +
        " week3  as week3,  " +
        " week4  as week4,  " +
        " week5  as week5,  " +
        " week6  as week6,  " +
        " week7  as week7,  " +
        " week8  as week8,  " +
        " week9  as week9,  " +
        " week10 as week10, " +
        " week11 as week11, " +
        " week12 as week12, " +
        " week13 as week13, " +
        " week14 as week14, " +
        " week15 as week15, " +
        " week16 as week16, " +
        " week17 as week17, " +
        " week18 as week18, " +
        " week19 as week19, " +
        " week20 as week20, " +
        " week21 as week21, " +
        " week22 as week22, " +
        " week23 as week23, " +
        " week24 as week24, " +
        " week25 as week25, " +
        " week26 as week26, " +
        " week27 as week27, " +
        " week28 as week28, " +
        " week29 as week29, " +
        " week30 as week30, " +
        " week31 as week31, " +
        " week32 as week32, " +
        " week33 as week33, " +
        " week34 as week34, " +
        " week35 as week35, " +
        " week36 as week36, " +
        " week37 as week37, " +
        " week38 as week38, " +
        " week39 as week39, " +
        " week40 as week40, " +
        " week41 as week41, " +
        " week42 as week42, " +
        " week43 as week43, " +
        " week44 as week44, " +
        " week45 as week45, " +
        " week46 as week46, " +
        " week47 as week47, " +
        " week48 as week48, " +
        " week49 as week49, " +
        " week50 as week50, " +
        " week51 as week51, " +
        " week52 as week52 " +
        " from  AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecastDetail   " +
        " left join AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast main  on main.id = demandForecast_id  " +
        " where main.id in ( " +
        updateHWIdList +
        ")" +
        " and dataType = 3";
      var updateHWData = ObjectStore.queryByYonQL(updateHWsql);
      let hwData = updateHWData;
      // 构造供应商回复需求预测供应数据下传到华为的数据
      let factoryInventoryList = [];
      hwData &&
        hwData.map((item) => {
          let temp = {
            organizationId: item.organizationId,
            itemCode: item.itemCode,
            supplierCode: config.BASE.SUPPLIER_CODE,
            odmSupplierCode: item.odmSupplierCode,
            calcModeFlag: "Y",
            day1: item.day1,
            day2: item.day2,
            day3: item.day3,
            day4: item.day4,
            day5: item.day5,
            day6: item.day6,
            day7: item.day7,
            day8: item.day8,
            day9: item.day9,
            day10: item.day10,
            day11: item.day11,
            day12: item.day12,
            day13: item.day13,
            day14: item.day14,
            day15: item.day15,
            day16: item.day16,
            day17: item.day17,
            day18: item.day18,
            day19: item.day19,
            day20: item.day20,
            day21: item.day21,
            dataType: "102",
            week1: item.week1,
            week2: item.week2,
            week3: item.week3,
            week4: item.week4,
            week5: item.week5,
            week6: item.week6,
            week7: item.week7,
            week8: item.week8,
            week9: item.week9,
            week10: item.week10,
            week11: item.week11,
            week12: item.week12,
            week13: item.week13,
            week14: item.week14,
            week15: item.week15,
            week16: item.week16,
            week17: item.week17,
            week18: item.week18,
            week19: item.week19,
            week20: item.week20,
            week21: item.week21,
            week22: item.week22,
            week23: item.week23,
            week24: item.week24,
            week25: item.week25,
            week26: item.week26,
            week27: item.week27,
            week28: item.week28,
            week29: item.week29,
            week30: item.week30,
            week31: item.week31,
            week32: item.week32,
            week33: item.week33,
            week34: item.week34,
            week35: item.week35,
            week36: item.week36,
            week37: item.week37,
            week38: item.week38,
            week39: item.week39,
            week40: item.week40,
            week41: item.week41,
            week42: item.week42,
            week43: item.week43,
            week44: item.week44,
            week45: item.week45,
            week46: item.week46,
            week47: item.week47,
            week48: item.week48,
            week49: item.week49,
            week50: item.week50,
            week51: item.week51,
            week52: item.week52
          };
          factoryInventoryList.push(temp);
        });
      let X_HW_ID = config.BASE.X_HW_ID;
      let X_HW_APPKEY = config.BASE.X_HW_APPKEY;
      let UpdateForecastCloudUrl = config.BASE.URL + config.API_URL.UpdateForecastCloud;
      // 记录调华为接口日志
      let body10Log = {
        methodName: "updateForecastCloud",
        requestParams: JSON.stringify(factoryInventoryList),
        url: UpdateForecastCloudUrl,
        requestTime: new Date().format("yyyy-MM-dd hh:mm:ss")
      };
      let header = {
        "X-HW-ID": X_HW_ID,
        "X-HW-APPKEY": X_HW_APPKEY,
        "Content-Type": "application/json"
      };
      if (factoryInventoryList.length == 0) {
        throw new Error("无数据需推送S,请检查数据");
      }
      let strResponse = postman("post", UpdateForecastCloudUrl, JSON.stringify(header), JSON.stringify(factoryInventoryList));
      let responseJson = JSON.parse(strResponse);
      body10Log.respResult = JSON.stringify(responseJson);
      body10Log.respTime = new Date().format("yyyy-MM-dd hh:mm:ss");
      //更新数据状态为供应商回复
      let updateObjects2 = [];
      updateHWIds.forEach((item) => {
        let updateObject = {
          id: item,
          dataStatus: "4",
          errorDesc: ""
        };
        updateObjects2.push(updateObject);
      });
      var updateObjectRes = ObjectStore.updateBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast", updateObjects2, "ybe05ef960");
      //根据接口请求结果构建返回信息
      if (responseJson.code == 200) {
        retData["code"] = "200";
        retData["message"] = "供应商回复需求预测供应数据成功。";
        body10Log.errorMsg = "供应商回复需求预测供应数据成功";
        ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", body10Log, "yb6b993e05");
      } else {
        retData["code"] = responseJson.code;
        retData["message"] = responseJson.message;
        body10Log.errorMsg = responseJson.message;
        ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", body10Log, "yb6b993e05");
      }
    }
    return retData;
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