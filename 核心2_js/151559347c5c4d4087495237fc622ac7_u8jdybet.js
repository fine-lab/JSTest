viewModel.on("afterLoadData", function (arg) {
  console.log("afterLoadData---------------");
  if (viewModel.getParams().mode == "edit") {
    let data = viewModel.getParams().data;
    viewModel.setData(data);
  }
});
viewModel.get("btnAbandon") &&
  viewModel.get("btnAbandon").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 确定--单击
    var parentgm = viewModel.getCache("parentViewModel").get("AddressList");
    var data = viewModel.getAllData();
    if (viewModel.getParams().mode == "edit") {
      parentgm.updateRow(parentgm.getFocusedRowIndex(), data);
    } else if (viewModel.getParams().mode == "add") {
      parentgm.appendRow(data);
    }
    viewModel.communication({ type: "modal", payload: { data: false } });
  });