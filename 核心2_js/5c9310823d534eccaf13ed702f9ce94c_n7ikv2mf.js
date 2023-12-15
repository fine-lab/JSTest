viewModel.on("customInit", function (data) {
  // 业绩归属行业--页面初始化
});
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
viewModel.get("button13ng") &&
  viewModel.get("button13ng").on("click", function (data) {
    let res = cb.rest.invokeFunction("AT17E908FC08280001.backDesignerFunction.test1", {}, function (err, res) {}, viewModel, { async: false });
    console.log(res);
  });