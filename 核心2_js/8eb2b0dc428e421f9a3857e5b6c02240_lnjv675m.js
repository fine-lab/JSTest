viewModel.get("button13yd") &&
  viewModel.get("button13yd").on("click", function (data) {
    // 删除--单击
    setTimeout(function () {
      viewModel.execute("refresh");
    }, 1000);
  });