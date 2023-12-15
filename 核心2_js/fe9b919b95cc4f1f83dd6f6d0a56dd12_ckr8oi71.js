viewModel.get("value") &&
  viewModel.get("value").on("blur", function (data) {
    // 海关编码--失去焦点的回调
    cb.rest.invokeFunction("AT172DC53E1D280006.basicdataFunction.customsDataAPI", {}, function (err, res) {
      console.log(err, res);
    });
  });