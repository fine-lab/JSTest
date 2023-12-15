viewModel.get("button15qd") &&
  viewModel.get("button15qd").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT1764FBE617500005.test.clearData", {}, function (err, res) {
      debugger;
      console.log(res);
    });
  });