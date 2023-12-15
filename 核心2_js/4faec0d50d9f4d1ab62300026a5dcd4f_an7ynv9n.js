let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //由于服务器的时间没设置中国时区,所以手动转化为中国时间
    const date = new Date();
    const offset = 8; // 中国时区为UTC+8
    const utc = date.getTime() + date.getTimezoneOffset() * 60000; // 计算当前时间的UTC时间戳
    const localDate = new Date(utc + 3600000 * offset); // 根据偏移量计算中国时区的时间
    const year = localDate.getFullYear();
    const month = ("0" + (localDate.getMonth() + 1)).slice(-2);
    const day = ("0" + localDate.getDate()).slice(-2);
    const hour = ("0" + localDate.getHours()).slice(-2);
    const minute = ("0" + localDate.getMinutes()).slice(-2);
    const second = ("0" + localDate.getSeconds()).slice(-2);
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return { formattedDate };
  }
}
function showTime(t) {
  var time;
  time = t > 10 ? t : "0" + t;
  return time;
}
exports({ entryPoint: MyTrigger });