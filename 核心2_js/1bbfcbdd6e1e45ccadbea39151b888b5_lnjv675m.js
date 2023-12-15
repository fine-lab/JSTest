viewModel.on("customInit", function (data) {
  // 零售打印列表详情--页面初始化
  viewModel.on("afterLoadData", function () {
    setTimeout(function () {
      viewModel.get("button28mb").execute("click");
      setTimeout(function () {
        viewModel.communication({ type: "modal", payload: { data: false } });
      }, 3000);
    }, 1000);
  });
});