viewModel.on("afterLoadData", () => {
  if (viewModel.getCache("isPageModel")) {
    viewModel.execute("updateViewMeta", {
      code: "f2233898369f4f69a0acce3674924616",
      visible: false
    });
    viewModel.execute("updateViewMeta", {
      code: "listheader7hb",
      visible: true
    });
  } else {
    viewModel.execute("updateViewMeta", {
      code: "listheader7hb",
      visible: false
    });
  }
});
viewModel.get("button21ha") &&
  viewModel.get("button21ha").on("click", function (data) {
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