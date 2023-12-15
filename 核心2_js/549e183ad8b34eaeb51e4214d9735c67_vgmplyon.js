viewModel.get("CHK_SPOTList") &&
  viewModel.get("CHK_SPOTList").getEditRowModel() &&
  viewModel.get("CHK_SPOTList").getEditRowModel().get("增加巡检项") &&
  viewModel
    .get("CHK_SPOTList")
    .getEditRowModel()
    .get("增加巡检项")
    .on("blur", function (data) {
      // 超链接13--失去焦点的回调
    });
viewModel.get("btnAddRowCHK_SPOT") &&
  viewModel.get("btnAddRowCHK_SPOT").on("click", function (data) {
    // 增行--单击
  });