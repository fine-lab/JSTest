viewModel.get("specialoffer_bList") &&
  viewModel.get("specialoffer_bList").getEditRowModel() &&
  viewModel.get("specialoffer_bList").getEditRowModel().get("stopdate") &&
  viewModel
    .get("specialoffer_bList")
    .getEditRowModel()
    .get("stopdate")
    .on("valueChange", function (data) {
      // 截止日期--值改变
      debugger;
    });