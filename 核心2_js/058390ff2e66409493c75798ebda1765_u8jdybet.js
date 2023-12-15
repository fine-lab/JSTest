viewModel.get("button24ae") &&
  viewModel.get("button24ae").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button29zc") &&
  viewModel.get("button29zc").on("click", function (data) {
    // 按钮2--单击
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucher",
        billno: "5afb5139",
        params: {
          id: "youridHere",
          mode: "browse",
          readOnly: true,
          domainKey: "yourKeyHere"
        }
      },
      viewModel
    );
  });