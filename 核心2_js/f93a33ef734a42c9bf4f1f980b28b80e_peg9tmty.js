viewModel.get("button24td") &&
  viewModel.get("button24td").on("click", function (data) {
    // 按钮--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    var rows = gridModel.getSelectedRows();
    for (var i = 0; i < rows.length; i++) {
      var rowData = rows[i];
      var id = rowData.id;
      var result = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.haha", { id }, function (err, res) {}, viewModel, { async: false });
    }
  });