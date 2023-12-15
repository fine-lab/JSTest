viewModel.on("customInit", function (data) {
  //员工信息采集一主多子--页面初始化
  viewModel.setState("bIsNull", true);
  viewModel.getGridModel().setState("bIsNull", true);
});
viewModel.get("new1") &&
  viewModel.get("new1").on("afterValueChange", function (data) {
    //字段1--值改变后
    debugger;
    viewModel.setState("bIsNull", true);
    viewModel.getGridModel().setState("bIsNull", true);
  });