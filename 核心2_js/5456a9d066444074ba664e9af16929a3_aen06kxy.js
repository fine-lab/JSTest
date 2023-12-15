viewModel.get("button24vg") &&
  viewModel.get("button24vg").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("GT29AT27.api.deleteBatch", {}, function (err, res) {
      cb.utils.alert(err, "error");
    });
  });