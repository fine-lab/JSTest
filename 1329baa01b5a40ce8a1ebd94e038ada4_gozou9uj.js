let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let env = ObjectStore.env();
    let retData = {
      code: "200",
      message: "供应商回复需求预测供应数据成功"
    };
    //记录日志
    let logData = {
      methodName: "htRequireReturn",
      requestParams: JSON.stringify(request),
      url: env.url + "/iuap-api-gateway/rz296oih/product_ref/product_ref_01/htRequireReturn",
      requestTime: getDate()
    };
    //接收更新华为接口的预测数据id
    let updateHWIds = [];
    let requestData = request.data;
    if (requestData == null) {
      throw new Error("入参不能为空");
    }
    let lineId = "";
    let sdPeriod = "";
    let atpWk = [];
    let day7 = "day7";
    let day14 = "day14";
    let day21 = "day21";
    try {
      requestData.map((item, i) => {
        lineId = item.line_id;
        if (lineId == null) {
          throw new Error("行ID不能为空");
        }
        delete item.line_id;
        sdPeriod = item.sd_period;
        if (sdPeriod == null) {
          throw new Error("SD期次不能为空");
        }
        delete item.sd_period;
        let sql =
          "select id as predictionApiInfoId  from  AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast  " +
          " where id = '" +
          lineId +
          "'";
        var res = ObjectStore.queryByYonQL(sql);
        let predictionApiInfoId;
        if (res.length > 0) {
          predictionApiInfoId = res[0].predictionApiInfoId;
          item.demandForecast_id = predictionApiInfoId;
          updateHWIds.push(predictionApiInfoId);
        }
        atpWk = item.atp_wk;
        if (atpWk == null) {
          throw new Error("52周的预测返回数不能为空");
        }
        //供应
        item.dataType = 3;
        if (atpWk.length != 52) {
          throw new Error("预测返回数不是52周数据");
        }
        for (var i = 0; i < atpWk.length; i++) {
          let key = "week" + (i + 1);
          item[key] = atpWk[i];
          if (key == "week1") {
            item[day7] = atpWk[i];
          }
          if (key == "week2") {
            item[day14] = atpWk[i];
          }
          if (key == "week3") {
            item[day21] = atpWk[i];
          }
        }
        delete item.atp_wk;
        //查询老数据
        let detailsql = "select demandForecast_id from  AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecastDetail  " + " where demandForecast_id= '" + item.demandForecast_id + "' and dataType = 3";
        var detailRes = ObjectStore.queryByYonQL(detailsql);
        if (detailRes.length > 0) {
          //删除老数据
          var deleteobject = { demandForecast_id: item.demandForecast_id, dataType: 3 };
          var res = ObjectStore.deleteByMap("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecastDetail", deleteobject, "yb159db6f3");
        }
        var saveRes = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecastDetail", item, "yb159db6f3");
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      try {
        logData.respTime = getDate();
        ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logData, "yb6b993e05");
      } catch (e) {
        // 日志写入报错，不做任何处理
        console.log("供应商调用htRequireReturn接口回复需求预测异常");
      }
    }
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    //更新数据状态为供应商回复
    let updateObjects = [];
    updateHWIds.forEach((item) => {
      let updateObject = {
        id: item,
        dataStatus: "3"
      };
      updateObjects.push(updateObject);
    });
    //更新为供应商已回复
    var updateObjectRes = ObjectStore.updateBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast", updateObjects, "ybe05ef960");
    //调华为接口将供应数据传给华为
    //查询供应商回复的所有数据
    let updateHWIdList = "";
    if (updateHWIds) {
      updateHWIdList = updateHWIds.join(",");
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
        requestTime: getDate()
      };
      let header = {
        "X-HW-ID": X_HW_ID,
        "X-HW-APPKEY": X_HW_APPKEY,
        "Content-Type": "application/json"
      };
      let strResponse = postman("post", UpdateForecastCloudUrl, JSON.stringify(header), JSON.stringify(factoryInventoryList));
      let responseJson = JSON.parse(strResponse);
      body10Log.respResult = JSON.stringify(responseJson);
      body10Log.respTime = getDate();
      //更新数据状态为供应商回复
      let updateObjects2 = [];
      updateHWIds.forEach((item) => {
        let updateObject = {
          id: item,
          dataStatus: "4"
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
        let updateObjects3 = [];
        updateHWIds.forEach((item) => {
          let updateObject = {
            id: item,
            errorDesc: responseJson.message
          };
          updateObjects3.push(updateObject);
        });
        var updateObjectRes = ObjectStore.updateBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast", updateObjects3, "ybe05ef960");
      }
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