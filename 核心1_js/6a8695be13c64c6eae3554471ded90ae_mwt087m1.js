viewModel.get("new1") &&
  viewModel.get("new1").on("afterValueChange", function (data) {
    // 字段1--值改变后
    cb.rest.invokeFunction("5470dc25bee94060930ddb3de0eccba2", {}, function (err, res) {
      console.log("err", err);
      console.log("res", res);
    });
  });