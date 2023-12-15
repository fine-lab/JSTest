viewModel.on("customInit", function (data) {
  // 船舶证照--页面初始化
  debugger;
  var alldata = viewModel.getAllData();
  var pp = cb.rest.invokeFunction("AT15DC453609680006.aap.diaoyong", { data: data }, function (err, res) {}, viewModel, { async: false });
});