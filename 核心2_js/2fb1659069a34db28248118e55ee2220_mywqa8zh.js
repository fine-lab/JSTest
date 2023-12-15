debugger;
viewModel.on("customInit", function (data) {
  // 后端函数详情--页面初始化
  var telephone = event.params.value;
  var serviceUel = viewModel.getAppContext().serviceUel;
});
viewModel.get("telephone") &&
  viewModel.get("telephone").on("afterValueChange", function (data) {
    // 电话--值改变后
  });