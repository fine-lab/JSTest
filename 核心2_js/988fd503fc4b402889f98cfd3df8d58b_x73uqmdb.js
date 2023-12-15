let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let startTime1 = new Date(new Date(new Date().toLocaleDateString()).getTime()); // 当天0点
    let endTime1 = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1); // 当天23:59
    function parseTime(time, cFormat) {
      if (arguments.length === 0) {
        return null;
      }
      const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
      let date;
      if (typeof time === "object") {
        date = time;
      } else {
        if (("" + time).length === 10) time = parseInt(time) * 1000;
        date = new Date(time);
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      };
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === "a") return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
        if (result.length > 0 && value < 10) {
          value = "0" + value;
        }
        return value || 0;
      });
      return time_str;
    }
    var startTime = parseTime(startTime1);
    var endTime = parseTime(endTime1);
    let url = "https://www.example.com/" + startTime + "&endTime=" + endTime;
    let apiResponse = postman("GET", url, null, null);
    let info = JSON.parse(apiResponse);
    var arr = [];
    if (info.length > 0) {
      for (let i = 0; i < info.length; i++) {
        arr.push(info[i]);
      }
      ObjectStore.insertBatch("GT99721AT51.GT99721AT51.userinfo", arr, "bf315266");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });