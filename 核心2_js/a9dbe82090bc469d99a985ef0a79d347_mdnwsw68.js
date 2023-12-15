let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d;
    };
    let p1 = request.p1;
    console.log("p1=====" + p1);
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    let dateStr = formatDate(date);
    let sql = "select id,price from marketing.price.PriceRecord where dimension.productId='" + p1 + "' and enable = 1 and beginDate < '" + dateStr + "' and endDate > '" + dateStr + "'";
    console.log("sql=====" + sql);
    var res = ObjectStore.queryByYonQL(sql, "marketingbill");
    let a = res[0].price;
    console.log("id=====" + a);
    return { price: a };
  }
}
exports({ entryPoint: MyAPIHandler });