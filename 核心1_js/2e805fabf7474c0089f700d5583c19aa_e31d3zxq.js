viewModel.on("customInit", function (data) {
  viewModel.on("afterLoadData", function (args) {
    debugger;
  });
  //时间格式化（字符串）；
  function dateStr(nowDate) {
    let maxDate = new Date(nowDate);
    let year = maxDate.getFullYear();
    let month = maxDate.getMonth() + 1;
    let day = maxDate.getDate();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    let dateTime = year + "-" + month + "-" + day;
    return dateTime;
  }
});