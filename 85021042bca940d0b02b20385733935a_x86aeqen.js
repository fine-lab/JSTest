viewModel.on("afterLoadData", () => {
  if (viewModel.getCache("isPageModel")) {
    viewModel.execute("updateViewMeta", {
      code: "SingleCardLeftHeader",
      visible: false
    });
  }
});
viewModel.get("button19hc") &&
  viewModel.get("button19hc").on("click", function (data) {
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
        billno: "htjbxx"
      },
      viewModel
    );
  });
viewModel.get("button24si") &&
  viewModel.get("button24si").on("click", function (data) {
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
        billno: "htjbxx"
      },
      viewModel
    );
  });