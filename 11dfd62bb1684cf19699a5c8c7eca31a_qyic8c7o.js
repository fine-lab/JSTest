viewModel.on("customInit", function (data) {
  // 机构审批设置--页面初始化
});
viewModel.get("button15uc") &&
  viewModel.get("button15uc").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT170DEAD017A80007.interface.queryAttPerson", {}, function (err, res) {
      debugger;
      console.log(res);
    });
  });