viewModel.get("button19th") &&
  viewModel.get("button19th").on("click", function (data) {
    // 按钮--单击
    var tt = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.ttttt", {}, function (err, res) {}, viewModel, { async: false });
    if (tt.error) {
      cb.utils.alert(tt.error.message);
      return false;
    }
  });