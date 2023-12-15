let AbstractTrigger = require("AbstractTrigger");
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取参数-写入数据库
    let appContext = JSON.parse(AppContext());
    let usrName = appContext.currentUser.name;
    let logTime = getNowDate();
    let paramObj = JSON.parse(param);
    if (paramObj.LogToDB) {
      var object = { logModule: paramObj.logModule, description: paramObj.description, reqt: paramObj.reqt, resp: paramObj.resp, logTime: logTime, editor: usrName, ymonth: substring(logTime, 0, 7) };
      var res = ObjectStore.insert("GT3734AT5.GT3734AT5.ifLog", object, "402c0dfb");
      return { res };
    } else {
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });