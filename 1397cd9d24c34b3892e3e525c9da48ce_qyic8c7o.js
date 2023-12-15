viewModel.on("customInit", function (data) {
  // 测试--页面初始化
});
viewModel.get("button13le") &&
  viewModel.get("button13le").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT16A11A2C17080008.Test.UpdateData", {}, function (err, res) {
      debugger;
      console.log(res);
    });
  });