viewModel.get("finishedReportDetail") &&
  viewModel.get("finishedReportDetail").getEditRowModel() &&
  viewModel.get("finishedReportDetail").getEditRowModel().get("extendmybs") &&
  viewModel
    .get("finishedReportDetail")
    .getEditRowModel()
    .get("extendmybs")
    .on("valueChange", function (data) {
      // 工业互联网标识--值改变
    });