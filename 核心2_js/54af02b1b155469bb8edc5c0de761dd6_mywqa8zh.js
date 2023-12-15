viewModel.on("customInit", function (data) {
  // 金建出证合同详情--页面初始化
  viewModel.on("afterLoadData", function () {
    let liushuihao = viewModel.get("code").getValue();
    viewModel.get("chuzhenghetonghao").setValue(liushuihao);
  });
});