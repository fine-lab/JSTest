viewModel.get("button19ff") &&
  viewModel.get("button19ff").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("IMP_PES.DemoFunction.setValueDemo", {}, function (err, res) {
      debugger;
    });
  });