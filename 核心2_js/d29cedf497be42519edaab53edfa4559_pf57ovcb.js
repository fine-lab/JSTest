//客户档案同步sap脚本
viewModel.get("button55li") &&
  viewModel.get("button55li").on("click", function (data) {
    // 同步sap--单击
    let selectRows = viewModel.getGridModel().getSelectedRows();
    let result = cb.rest.invokeFunction("GZTBDM.shibin.syncCustomerSap", { rows: selectRows }, function (err, res) {}, viewModel, { async: false });
    alert("同步中，请稍后查看列表");
  });