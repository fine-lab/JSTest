viewModel.on("customInit", function (data) {
  // 出国（境）回程--页面初始化
  viewModel.on("afterLoadMeta", function (data) {
    // 隐藏一个主表字段
    viewModel.get("btnBizFlowBatchPush").setVisible(false);
  });
});