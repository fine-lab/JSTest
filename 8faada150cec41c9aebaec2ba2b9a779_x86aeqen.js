viewModel.get("button4fd") &&
  viewModel.get("button4fd").on("click", function (data) {
    // 编辑--单击
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucher",
        params: {
          id: viewModel.getAllData().id,
          mode: "edit",
          domainKey: "yourKeyHere"
        },
        billno: "ym1"
      },
      viewModel
    );
  });