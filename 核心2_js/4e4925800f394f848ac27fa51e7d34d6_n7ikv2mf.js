let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var newBeiJingDate = function () {
      var d = new Date(); //创建一个Date对象
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
      var gmt = localTime + localOffset; //GMT时间
      var offset = 8; //东8区
      var beijing = gmt + 3600000 * offset;
      var nd = new Date(beijing);
      return nd;
    };
    function addDaysToDate(date, days) {
      var res = new Date(date);
      res.setDate(res.getDate() + days);
      return res;
    }
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    let begin_ts = formatDateTime(addDaysToDate(newBeiJingDate(), -3)); //2023-01-01 12:00:00
    let end_ts = formatDateTime(newBeiJingDate()); //2023-01-31 23:59:59
    let size = 100;
    for (var page = 0; page < 1; page++) {
      let param1 = { begin_ts, end_ts, page, size };
      let func = extrequire("AT17E908FC08280001.backDesignerFunction.SynYCContract");
      let res = func.execute(param1);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });