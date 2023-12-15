viewModel.get("button30kg") &&
  viewModel.get("button30kg").on("click", function (data) {
    // 判定--单击
    debugger;
    let listData = viewModel.getGridModel().getSelectedRows(); //获取当前页已选中行的数据
    let cangku = listData[0].cangku;
    var inner = cb.rest.invokeFunction("AT16560C6C08780007.frontDesignerFunction.warehouseList", { cangku: cangku }, function (err, res) {}, viewModel, { async: false });
    if (inner == 0) {
    }
  });