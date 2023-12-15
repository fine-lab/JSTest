viewModel.get("button24uc") &&
  viewModel.get("button24uc").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("GT28AT1.hd.fewfew", {}, function (err, res) {
      alert(JSON.stringify(res));
    });
  });