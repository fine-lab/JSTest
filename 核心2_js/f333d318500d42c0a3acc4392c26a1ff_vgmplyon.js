viewModel.on("customInit", function (data) {
  // 订单管理详情--页面初始化
  viewModel.on("afterRule", function (event) {
    if (cb.utils.getUser().userCode === "YHT-1056679-10568701651104864924") {
      viewModel.execute("updateViewMeta", {
        code: "tabpane8fi",
        visible: false
      });
    }
  });
});