let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 此处时间戳以毫秒为单位
    let timetem = parseTime(Date.parse(new Date()), "{y}-{m}-{d} {h}:{i}:{s}");
    let object = {
      orderCode: request.orderCode,
      status: request.status,
      subQty: request.subQty,
      hisused: request.hisused,
      used: request.used,
      headid: request.headid,
      bodyid: request.bodyid,
      def1: request.def1,
      date: timetem,
      dr: 0
    };
    return ObjectStore.insert("GT80750AT4.GT80750AT4.yslogs", object, "yb5f235f29");
    function parseTime(time, cFormat, zone = 8) {
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
      // 时区调整
      const utc = time + new Date(time).getTimezoneOffset() * 60000;
      const wishTime = utc + 3600000 * zone;
      date = new Date(wishTime);
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      };
      const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === "a") {
          return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        if (result.length > 0 && value < 10) {
          value = "0" + value;
        }
        return value || 0;
      });
      return timeStr;
    }
  }
}
exports({ entryPoint: MyAPIHandler });