run = function (event) {
  var viewModel = this;
  //页面数据加载完毕
  viewModel.on("afterMount", function (args) {
    debugger;
    viewModel.on("afterLoadData", function (data) {
      debugger;
      let manufacturerDate = viewModel.get("manufacturerDate").getValue();
      let manufacturerDate1 = getDate(manufacturerDate);
      viewModel.get("manufacturerDate").setValue(manufacturerDate1);
    });
  });
  function getDate(date) {
    if (date != undefined) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let dateTime = year + "-" + month + "-" + day;
      return dateTime;
    }
  }
};