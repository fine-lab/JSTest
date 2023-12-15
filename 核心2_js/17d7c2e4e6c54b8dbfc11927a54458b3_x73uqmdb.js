viewModel.on("customInit", function (data) {
  // 主子孙详情--页面初始化
});
viewModel
  .get("zzsdsList")
  .getEditRowModel()
  .get("new1")
  .on("blur", function () {
    viewModel.get("zzsdsList").getEditRowModel().get("customType").setValue("1");
    viewModel.get("customType").setValue("0");
  });