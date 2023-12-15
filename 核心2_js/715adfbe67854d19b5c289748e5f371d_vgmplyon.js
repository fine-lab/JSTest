viewModel.get("button21hi") &&
  viewModel.get("button21hi").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT165642F408780007.backDesignerFunction.Test221209CWH", {}, function (err, res) {
      debugger;
    });
  });