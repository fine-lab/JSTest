viewModel.get("button19be") &&
  viewModel.get("button19be").on("click", function (data) {
    // 测试按钮--单击
    var tt = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.ttttttt", {}, function (err, res) {}, viewModel, { async: false });
    if (tt.error) {
      cb.utils.alert(tt.error.message);
      return false;
    }
  });