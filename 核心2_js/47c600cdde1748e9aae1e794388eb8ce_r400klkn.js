let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let trace_code = request.trace_code;
    let url = "https://www.example.com/";
    let app_key = "yourkeyHere";
    let yoursecretHere = "yoursecretHere";
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let obj = {
      method: "alibaba.alihealth.drug.getbarcode.bytraccode",
      app_key: "yourkeyHere",
      timestamp: dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss"),
      v: "2.0",
      sign_method: "md5",
      sign: "",
      format: "json",
      trace_code: trace_code
    };
    obj.sign = signTopRequest(obj, secret);
    let strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(obj));
    return { strResponse: strResponse };
    function signTopRequest(obj, secret) {
      let keysString = "";
      let keysSort = Object.keys(obj).sort();
      for (let i = 0; i < keysSort.length; i++) {
        if (keysSort[i] != "sign") {
          keysString += keysSort[i] + obj[keysSort[i]];
        }
      }
      return MD5Encode(secret + keysString + secret);
    }
    //时间格式化
    function dateFormat(date, format) {
      date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "H+": date.getHours() + 8, //hour+8小时
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});