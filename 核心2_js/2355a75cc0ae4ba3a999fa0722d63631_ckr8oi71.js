viewModel.get("button29ga") &&
  viewModel.get("button29ga").on("click", function (data) {
    // 取消--单击
  });
viewModel.get("button31ri") &&
  viewModel.get("button31ri").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT172DC53E1D280006.basicdataFunction.customsDataAPI", {}, function (err, res) {
      console.log(err, res);
    });
  });