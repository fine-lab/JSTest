viewModel.get("button31lc") &&
  viewModel.get("button31lc").on("click", function (data) {
    //保存日志--单击
    debugger;
    var test = viewModel.getGridModel("AttachmentList").getDirtyData();
    viewModel.getGridModel("AttachmentList").appendRow({ new1: "23", new2: "1" });
  });