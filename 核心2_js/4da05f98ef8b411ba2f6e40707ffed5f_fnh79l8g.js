viewModel.on("customInit", function (data) {
  // 期初押金详情--页面初始化
  viewModel.on("beforePush", function (args) {
    var verifystate = viewModel.getAllData().verifystate;
    if (2 != verifystate) {
      cb.utils.alert("未审核的单据不允许下推!");
      return false;
    }
  });
});