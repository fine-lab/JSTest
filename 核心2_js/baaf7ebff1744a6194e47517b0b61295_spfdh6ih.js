viewModel.on("customInit", function (data) {
  // 测试页签详情--页面初始化
});
//保存前事件
viewModel.on("beforeSave", function (parmas) {
  var ss = cb.rest.invokeFunction("GT65690AT1.backDefaultGroup.ttttt", {}, function (err, res) {}, viewModel, { async: false });
  return false;
});