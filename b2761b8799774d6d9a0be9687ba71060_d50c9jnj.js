viewModel.get("button23vd") &&
  viewModel.get("button23vd").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("GT37595AT2.backOpenApiFunction.ttttest", {}, function (err, res) {
      debugger;
    });
  });