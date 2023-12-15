viewModel.on("customInit", function (data) {
  // 营销目标详情--页面初始化
  debugger;
  var res = cb.rest.invokeFunction("GT101792AT1.API.currentUser", {}, function (err, res) {}, viewModel, { async: false });
});