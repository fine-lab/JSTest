viewModel.get("button29mj") &&
  viewModel.get("button29mj").on("click", function (data) {
    //按钮--单击.
    cb.rest.invokeFunction("GT9912AT31.common.checkDMYUser", {}, function (err, res) {
      console.log(res);
    });
  });