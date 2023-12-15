function init(event) {
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", function (event) {
    let gridModel = this;
    // 获取当前编辑单元格模型
    let enable = gridModel.get("editRowModel").get("enable");
    enable.on("beforeValueChange", function (event) {
      let s = 1;
    });
  });
  gridModel.on("beforeCellValueChange", function (event) {
    cb.utils.alert("0");
  });
}