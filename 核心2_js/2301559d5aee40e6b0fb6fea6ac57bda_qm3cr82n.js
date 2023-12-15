viewModel.get("button14sf") &&
  viewModel.get("button14sf").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("", {}, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });