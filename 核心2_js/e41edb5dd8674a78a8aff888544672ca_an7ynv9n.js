let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let object = {
      used: "970",
      subQty: "10",
      dr: 0,
      hisused: "1980",
      orderCode: "code123",
      bodyid: "youridHere",
      headid: "youridHere",
      status: "update"
    };
    // 时间戳
    const timestamp = Date.parse(new Date());
    // 此处时间戳以毫秒为单位
    let date = new Date(timestamp);
    let Year = date.getFullYear();
    let Moth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let Day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let Hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let Minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let Sechond = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    let GMT = Year + "-" + Moth + "-" + Day + "   " + Hour + ":" + Minute + ":" + Sechond;
    let timetem = parseTime(timestamp, "{y}-{m}-{d} {h}:{i}:{s}");
    throw new Error(timetem);
    // 时间(可传入时间戳或时间对象)， 格式，时区，默认北京时区为东8
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
    return {};
  }
}
exports({ entryPoint: MyTrigger });