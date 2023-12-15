viewModel.get("button19kj") &&
  viewModel.get("button19kj").on("click", function (data) {
    debugger;
    // 新增--单击
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucher",
        params: {
          mode: "add",
          domainKey: "yourKeyHere"
        },
        billno: "xmhtxx"
      },
      viewModel
    );
  });
viewModel.get("button25tb") &&
  viewModel.get("button25tb").on("click", function (data) {
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
        billno: "xmhtxx"
      },
      viewModel
    );
  });