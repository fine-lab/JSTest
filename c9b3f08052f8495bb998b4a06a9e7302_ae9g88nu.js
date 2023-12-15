viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  viewModel.on("afterMount", function () {});
  //退回验收单生单
  viewModel.on("beforeSearch", function (args) {
    debugger;
    var rows = gridModel.getSelectedRows();
    if (rows.length < 1) {
      return cb.utils.alert("请选择数据", "alert");
    }
  });
});