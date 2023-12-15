viewModel.get("button27ah") &&
  viewModel.get("button27ah").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT17884E240950000A.backend.testapi", {}, function (err, res) {
      console.log(res);
    });
  });