viewModel.on("customInit", function (data) {
  // 期初押金--页面初始化
  viewModel.on("beforeBatchpush", function (args) {
    if (args.params.data.length > 1) {
      cb.utils.alert("1次只允许下推1条数据!");
      return false;
    } else {
      var verifystate = args.params.data[0].verifystate;
      if (2 != verifystate) {
        cb.utils.alert("未审核的单据不允许下推!");
        return false;
      }
    }
  });
});