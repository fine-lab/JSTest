viewModel.get("button24lb") &&
  viewModel.get("button24lb").on("click", function (data) {
    //按钮--单击
    debugger;
    var queryRes = cb.rest.invokeFunction("GT83441AT1.daQing.testlwy1019", {}, function (err, res) {}, viewModel, { async: false });
  });