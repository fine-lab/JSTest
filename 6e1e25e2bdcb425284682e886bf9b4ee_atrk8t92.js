var cSinmpleColor = "background: orange; padding: 4px 8px; border-radius: 2px;color:#666;font-weight:600;";
var cErrColor = "background: orange; padding: 4px 8px; border-radius: 2px;color:#666;font-weight:600;";
var cOkColor = "background: green; padding: 4px 8px; border-radius: 2px;color:#fff;font-weight:600;";
var gridModel = viewModel.getGridModel();
gridModel.on("beforeSetActionsState", (args) => {
  //表体的删除和复制行 隐藏
  args.forEach(function (item) {
    item.btnEdit.visible = false;
    item.btnCopy.visible = false;
  });
  console.log("%c %s", cOkColor, "beforeSetActionsState  √", args);
});
gridModel.setColumnState("new3", "formatter", function (rowInfo, rowData) {
  return {
  };
});
viewModel.on("filterClick", function (args) {
  console.log("%c %s", cOkColor, "filterClick  √", args);
});
viewModel.on("beforeSetState", function (data) {
  console.log("%c %s", cOkColor, "beforeSetState  √", data);
});