viewModel.get("rateList") &&
  viewModel.get("rateList").getEditRowModel() &&
  viewModel.get("rateList").getEditRowModel().get("bankname") &&
  viewModel
    .get("rateList")
    .getEditRowModel()
    .get("bankname")
    .on("valueChange", function (data) {
      // 品牌名称--值改变
      viewModel.get("rateList").getEditRowModel().get("bank").setValue("5813");
    });