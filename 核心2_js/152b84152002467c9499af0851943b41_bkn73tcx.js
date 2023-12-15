viewModel.get("button39dg") &&
  viewModel.get("button39dg").on("click", function (data) {
    debugger;
    // 下期成本--单击
    //获取当前的model
    let gridModel = viewModel.getGridModel();
    let gmgsr = gridModel.getSelectedRows();
    var inner = cb.rest.invokeFunction(
      "GT62395AT3.backDefaultGroup.createNaxtCost",
      { gmgsr: gmgsr },
      function (err, res) {
        if (res != null) {
          cb.utils.confirm(res);
        }
      },
      viewModel,
      { async: false }
    );
    if (inner == true) {
    }
  });