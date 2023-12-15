let AbstractAPIHandler = require("AbstractAPIHandler");
const tranDayToStr = (paramDate) => {
  //日期转字符串
  let syear = paramDate.getFullYear();
  let smonth = paramDate.getMonth() + 1;
  let sDate = paramDate.getDate();
  let dayStr = syear + "-" + (smonth >= 1 && smonth <= 9 ? "0" + smonth : smonth) + "-" + (sDate >= 1 && sDate <= 9 ? "0" + sDate : sDate);
  return dayStr;
};
const checkWorkDay = (paramTime, paramHoliday, paramWorkday) => {
  let paramDate = new Date(paramTime);
  let week = paramDate.getDay();
  let dayStr = tranDayToStr(paramDate);
  if (week > 0 && week < 6) {
    //周一到周五
    if (paramHoliday.indexOf(dayStr) > -1) {
      //节假日
      return false;
    } else {
      //工作日
      return true;
    }
  } else {
    //周六周日
    if (paramWorkday.indexOf(dayStr) > -1) {
      //调班工作日内
      return true;
    } else {
      //休息日
      return false;
    }
  }
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let res = AppContext();
    let obj = JSON.parse(res);
    let reqBeginDate = request.beginDate;
    let reqWorkDayNum = request.workDayNum;
    let oneDayTime = 24 * 60 * 60 * 1000;
    let paramHoliday = "";
    let paramWorkday = "";
    var sql = "select * from GT3734AT5.GT3734AT5.SelfDevParams where paramKey='yourKeyHere'";
    let resDb = ObjectStore.queryByYonQL(sql);
    if (resDb == null || resDb.length == 0) {
    } else {
      paramHoliday = resDb[0].paramHoliday;
      paramWorkday = resDb[0].paramWorkday;
      if (paramHoliday == null) {
        paramHoliday = "";
      }
      if (paramWorkday == null) {
        paramWorkday = "";
      }
    }
    let beginDate = new Date(reqBeginDate);
    let beginTime = beginDate.getTime();
    let endTime = beginTime;
    for (var i = 1; i <= reqWorkDayNum; i++) {
      do {
        endTime = endTime + oneDayTime;
      } while (!checkWorkDay(endTime, paramHoliday, paramWorkday));
    }
    let endDayStr = tranDayToStr(new Date(endTime));
    return { rst: true, endDayStr: endDayStr, paramHoliday: paramHoliday, paramWorkday: paramWorkday };
  }
}
exports({ entryPoint: MyAPIHandler });