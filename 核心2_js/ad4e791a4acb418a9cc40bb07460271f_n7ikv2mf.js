let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
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
    var addMonth = function (date, offset) {
      let givenMonth = date.getMonth();
      let newMonth = givenMonth + offset;
      let newDate = new Date(date.setMonth(newMonth));
      return formatMonth(newDate);
    };
    var formatMonth = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      return y + "" + m;
    };
    //设置时间带时分秒
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
    var currentMonth = formatMonth(newBeiJingDate());
    var object = {
      part_is_closed: false,
      part_pro_month: addMonth(newBeiJingDate(), -1)
    };
    let sql111 = "select * from AT17E908FC08280001.AT17E908FC08280001.part_out_resouce where part_pro_month='202306' and part_has_nextmonth2 is null";
    let res = ObjectStore.queryByYonQL(sql111);
    var newArr = [];
    for (var i = 0; i < res.length && i < 200; i++) {
      let obj = res[i];
      newArr.push({
        id: res[i].id,
        part_has_nextmonth2: "N"
      });
    }
    if (newArr.length > 0) {
      var res11 = ObjectStore.updateBatch("AT17E908FC08280001.AT17E908FC08280001.part_out_resouce", newArr, "ybd993b5aa");
      return { newArr, res11, res };
    }
    return { newArr, res };
  }
}
exports({ entryPoint: MyAPIHandler });