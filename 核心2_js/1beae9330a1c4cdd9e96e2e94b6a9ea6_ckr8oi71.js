viewModel.get("button25vc") &&
  viewModel.get("button25vc").on("click", function (data) {
    // 按钮--单击
    debugger;
    var qg = cb.rest.invokeFunction("AT17604A341D580008.pig02.ceshi", {}, function (err, res) {}, viewModel, { async: false });
  });