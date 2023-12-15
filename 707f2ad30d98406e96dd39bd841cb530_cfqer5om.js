viewModel.get("button48xf") &&
  viewModel.get("button48xf").on("click", function (data) {
    // 测试--单击
    debugger;
    let chengbenyuResult = cb.rest.invokeFunction("EAP.apitest01.apitest01", {}, function (err, res) {}, viewModel, { async: false });
  });