viewModel.get("button24gf") &&
  viewModel.get("button24gf").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT15BFE8B816C80007.backend.TestQryAction", {}, function (err, res) {
      debugger;
      console.log(err);
      console.log(res);
    });
  });