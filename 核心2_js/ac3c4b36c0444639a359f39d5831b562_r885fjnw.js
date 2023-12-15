viewModel.get("button22ve") &&
  viewModel.get("button22ve").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT17B405D009400004.test.getdata", {}, function (err, res) {
      console.log(res);
    });
  });