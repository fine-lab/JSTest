viewModel.on("modeChange", (args) => {
  //查询仓库
  if (viewModel.getParams().mode == "edit") {
    viewModel.getGridModel().setColumnState("bodyFreeItem!define2", "bCanModify", false);
    let org = viewModel.get("org").getValue();
    let result = cb.rest.invokeFunction("PU.backDesignerFunction.getWarehouse", { org: org }, function (err, res) {}, viewModel, { async: false });
    debugger;
    let id = result.result.res[0].id;
    let name = result.result.res[0].name;
    let rows = viewModel.get("arrivalOrders").getRows();
    let updateRows = [];
    let rowIndexes = [];
    rows.forEach((item, index) => {
      item.warehouse = id;
      item.warehouse_name = name;
      updateRows.push(item);
      rowIndexes.push(index);
    });
    viewModel.get("arrivalOrders").updateRows(rowIndexes, updateRows);
  }
});