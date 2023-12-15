let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeonds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    //目标时区时间，东八区
    var timezone = 8;
    // 本地时间和格林威治的时间差，单位为分钟
    var offset_GMT = new Date().getTimezoneOffset();
    // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    var nowDates = new Date().getTime();
    var targetDate = new Date(nowDates + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var nowDate = formatDateTime(targetDate);
    var updateWrapper1 = new Wrapper();
    var date = new Date();
    updateWrapper1.eq("order_status", "待使用").lt("start_time", nowDate).gt("end_time", nowDate);
    // 待更新字段内容
    var toUpdate1 = { order_status: "使用中" };
    // 执行更新
    var req1 = ObjectStore.update("GT16804AT364.GT16804AT364.board_room_order", toUpdate1, updateWrapper1, "e21b5656");
    var updateWrapper3 = new Wrapper();
    updateWrapper3.eq("order_status", "待使用").lt("end_time", nowDate);
    // 待更新字段内容
    var toUpdate3 = { order_status: "已完成" };
    // 执行更新
    var req3 = ObjectStore.update("GT16804AT364.GT16804AT364.board_room_order", toUpdate3, updateWrapper3, "e21b5656");
    var updateWrapper2 = new Wrapper();
    updateWrapper2.eq("order_status", "使用中").le("end_time", nowDate);
    // 待更新字段内容
    var toUpdate2 = { order_status: "已完成" };
    // 执行更新
    var req2 = ObjectStore.update("GT16804AT364.GT16804AT364.board_room_order", toUpdate2, updateWrapper2, "e21b5656");
    return {};
  }
}
exports({ entryPoint: MyTrigger });