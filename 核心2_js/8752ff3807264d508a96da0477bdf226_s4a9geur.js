viewModel.get("button98oi") &&
  viewModel.get("button98oi").on("click", function (data) {
    // 付款按钮--单击
    debugger;
    let selectedRows = viewModel.getGridModel().getSelectedRows();
    if (selectedRows == undefined || selectedRows.length != 1) {
      cb.utils.alert("请选择一行订单", "error");
      return;
    }
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher",
        billno: "6b292d81",
        params: {
          mode: "add",
          domainKey: "yourKeyHere",
          orderCode: selectedRows[0].code,
          orderName: selectedRows[0]["headParallel!orderSubject"],
          price: selectedRows[0].amountPayable
        }
      },
      viewModel
    );
  });
viewModel.get("button179rf") &&
  viewModel.get("button179rf").on("click", function (data) {
    // 评分按钮--单击
    debugger;
    let selectedRows = viewModel.getGridModel().getSelectedRows();
    if (selectedRows == undefined || selectedRows.length != 1) {
      cb.utils.alert("请选择一行订单", "error");
      return;
    }
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher",
        billno: "95467de9",
        params: {
          mode: "add",
          domainKey: "yourKeyHere",
          orderCode: selectedRows[0].code,
          orderName: selectedRows[0]["headParallel!orderSubject"]
        }
      },
      viewModel
    );
  });