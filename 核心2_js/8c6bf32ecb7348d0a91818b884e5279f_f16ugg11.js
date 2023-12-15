let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //每隔5分钟查一次截止当天内的前 50 条数据进行处理
    function getTimeStamp() {
      var date = new Date();
      //年
      var year = date.getFullYear().toString();
      //月
      var month = (date.getMonth() + 1).toString();
      month = month > 9 ? month : "0" + month;
      //日 getDate()：(1 ~ 31)
      var day = date.getDate().toString();
      day = day > 9 ? day : "0" + day;
      //时 getHours()：(0 ~ 23)
      var hour = date.getHours().toString();
      hour = hour > 9 ? hour : "0" + hour;
      //分 getMinutes()： (0 ~ 59)
      var minute = date.getMinutes().toString();
      minute = minute > 9 ? minute : "0" + minute;
      //秒 getSeconds()：(0 ~ 59)
      var second = date.getSeconds().toString();
      second = second > 9 ? second : "0" + second;
      var timeStamp = year + month + day + hour + minute + second;
      return timeStamp;
    }
    function getTimeDate() {
      var date = new Date();
      //年
      var year = date.getFullYear().toString();
      //月
      var month = (date.getMonth() + 1).toString();
      month = month > 9 ? month : "0" + month;
      //日 getDate()：(1 ~ 31)
      var day = date.getDate().toString();
      day = day > 9 ? day : "0" + day;
      //时 getHours()：(0 ~ 23)
      var hour = date.getHours().toString();
      hour = hour > 9 ? hour : "0" + hour;
      //分 getMinutes()： (0 ~ 59)
      var minute = date.getMinutes().toString();
      minute = minute > 9 ? minute : "0" + minute;
      //秒 getSeconds()：(0 ~ 59)
      var second = date.getSeconds().toString();
      second = second > 9 ? second : "0" + second;
      var timeStamp = year + "-" + month + "-" + day;
      return timeStamp;
    }
    var timeStamp = getTimeStamp();
    var queryBeginDt = getTimeDate() + " " + "00:00:00";
    var queryEndDt = getTimeDate() + " " + "23:59:59";
    var appId = "yourIdHere";
    var token = "yourtokenHere";
    var appSystem = "YS";
    var strSha1 = "AppId=" + appId + "&Timestamp=" + timeStamp + "&Token=" + token;
    //生成动态sign，转大写
    var sign = SHA1Encode(strSha1);
    sign = sign.toUpperCase();
    var signInfo = { sign: sign, timeStamp: timeStamp, appId: appId, token: token, appSystem: appSystem };
    var args = [
      {
        ReturnTimeStart: queryBeginDt,
        ReturnTimeEnd: queryEndDt,
        ReturnStatus: 1,
        PageIndex: 1
      }
    ];
    args = JSON.stringify(args);
    let body = { AppId: appId, Timestamp: timeStamp, Sign: sign, Args: args, AppSystem: appSystem };
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let url = "https://www.example.com/";
    var strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });