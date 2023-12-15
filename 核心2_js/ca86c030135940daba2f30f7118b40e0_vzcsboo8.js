viewModel.get("button16bj") &&
  viewModel.get("button16bj").on("click", function (data) {
    // 预警通知--单击
    cb.rest.invokeFunction("GT76712AT21.test.earlywarning", {}, function (err, res) {
      console.log("err", err);
      console.log("res", JSON.stringify(res));
    });
  });