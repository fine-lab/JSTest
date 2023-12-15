viewModel.get("button24qi") &&
  viewModel.get("button24qi").on("click", function (data) {
    // 测试脚本--单击
    cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.queryTable", {}, function (err, res) {
      alert(JSON.stringify(res));
      if (err) {
        alert(JSON.stringify(err));
      }
    });
  });