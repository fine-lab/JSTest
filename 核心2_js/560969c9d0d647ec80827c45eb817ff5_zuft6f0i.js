var modeChange01 = ""; //页面状态
viewModel.on("modeChange", function (e) {
  modeChange01 = e;
});
viewModel.get("year").on("afterValueChange", function (data) {
  //值改变哈偶
  let year = viewModel.get("year").getValue();
  if (year) {
    //有值才修改
    //是否有值
    if (viewModel.getGridModel().getAllData().length == 0) {
      viewModel.getGridModel().insertRows(1, init());
    }
    //更新
    //更新
    viewModel.getGridModel().setCellValues(getMonth(year));
  }
});
function getMonth(year, cellName = "cycle") {
  year = year.substring(0, 4);
  //动态生成12个月份
  var arr = [];
  for (let m = 1; m <= 12; m++) {
    let m1 = m < 10 ? "0" + m : m;
    arr.push({
      rowIndex: m - 1,
      cellName: cellName,
      value: year + "-" + m1
    });
  }
  return arr;
}
function init() {
  var dates = [];
  for (var i = 1; i <= 12; i++) {
    dates.push({
      rows: i
    });
  }
  return dates;
}