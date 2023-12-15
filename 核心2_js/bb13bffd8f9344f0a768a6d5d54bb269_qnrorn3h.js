viewModel.get("button24vg") &&
  viewModel.get("button24vg").on("click", function (data) {
    // 打开页面--单击
    var currentRow = viewModel.getGridModel().getRow(data.index);
    let code = currentRow.code; //获取行数据内容作为参数
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher",
        billno: "yb7775e1d7",
        params: {
          mode: "add",
          code: code
        }
      },
      viewModel
    );
  });