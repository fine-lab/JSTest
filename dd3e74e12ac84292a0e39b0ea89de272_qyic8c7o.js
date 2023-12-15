let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var feedBackData = param.data[0];
    if (feedBackData.def1 == 2) {
      var updateObject = {};
      updateObject.id = feedBackData.id;
      updateObject.submit_time = timetrans(feedBackData.modifyTime / 1000);
      var res = ObjectStore.updateById("GT65292AT10.GT65292AT10.Presales_feedback", updateObject);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
//时间转换
function timetrans(date) {
  var date = new Date(date * 1000 + 3600 * 8 * 1000); //如果date为13位不需要乘1000
  var Y = date.getFullYear() + "-";
  var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}