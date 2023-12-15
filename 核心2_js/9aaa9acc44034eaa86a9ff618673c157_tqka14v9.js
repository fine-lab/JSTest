viewModel.get("button19ae") &&
  viewModel.get("button19ae").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("GT94410AT1.backOpenApiFunction.测试", { billId: "1" }, function (err, res) {
      cb.utils.alert(res);
    });
  });