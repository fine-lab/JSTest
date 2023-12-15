viewModel.on("customInit", function (data) {
  // 测试人员3新详情--页面初始化
  console.log("测试人员3新详情--页面初始化");
  viewModel.on("afterSave", function () {
    const parentViewModel = viewModel.getCache("parentViewModel");
    if (parentViewModel) parentViewModel.execute("refresh");
  });
});