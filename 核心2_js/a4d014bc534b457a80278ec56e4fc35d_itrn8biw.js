viewModel.on("customInit", function (data) {
  // 开票申请单详情--页面初始化
  viewModel.on("modeChange", function name(data) {
    // 状态改变事件
    if (data == "add") {
      // 赋值上个页面传输的awayApplicationId
      viewModel.get("code").setValue(viewModel.getParams().code);
    }
  });
});