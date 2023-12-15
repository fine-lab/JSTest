viewModel.on("customInit", function (data) {
  // 参照员工学历证件学位详情--页面初始化
  alert("dfffd");
  viewModel.on("afterLoadData", function () {
    viewModel.get("item49pb").setValue("sdgsfg");
    viewModel.get("new1").setValue("rrrrrr");
  });
});