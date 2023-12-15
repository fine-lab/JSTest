viewModel.get("button24yi") &&
  viewModel.get("button24yi").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT165369EC09000003.apifunc.PPUserGetStaff", {}, function (err, res) {
      debugger;
    });
  });