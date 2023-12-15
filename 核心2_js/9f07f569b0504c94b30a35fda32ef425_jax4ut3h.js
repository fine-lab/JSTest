viewModel.get("button24jh") &&
  viewModel.get("button24jh").on("click", function (data) {
    // 按钮1224--单击
    cb.rest.invokeFunction("AT1672920C08100005.costApi.reimburseApi", {}, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });