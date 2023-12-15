viewModel.on("customInit", function (data) {
  viewModel.get("btnBatchSave").setVisible(false);
  viewModel.get("btnAddRow").setVisible(false);
});
viewModel.on("modeChange", function (data) {
  let params = viewModel.getParams();
  let mode = params.mode;
  debugger;
  if (mode == "edit") {
    viewModel.get("btnBatchSave").setVisible(true);
    viewModel.get("btnAddRow").setVisible(true);
    viewModel.get("button15jb").setVisible(false);
  } else {
    viewModel.get("btnBatchSave").setVisible(false);
    viewModel.get("btnAddRow").setVisible(false);
    viewModel.get("button15jb").setVisible(true);
  }
});
viewModel.getGridModel().on("beforeInsertRow", function (data) {
  let user = cb.utils.getUser();
  data.row["snCreator"] = user.userId;
  data.row["snCreator_name"] = user.userName;
});
viewModel.getGridModel().on("afterCellValueChange", function (event) {
  //任一值改变后，修改人
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  let user = cb.utils.getUser();
  debugger;
  viewModel.getGridModel().setCellValue(rowIndex, "snModifier", user.userId);
  viewModel.getGridModel().setCellValue(rowIndex, "snModifier_name", user.userName);
});