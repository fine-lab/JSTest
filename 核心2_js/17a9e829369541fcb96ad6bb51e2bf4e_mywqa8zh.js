viewModel.on("customInit", function (data) {
  // 服务中心人才库--页面初始化
  viewModel.on("afterMount", function () {
    //用于列表页面，初始化一些操作可以在这里实现，需要操作模型的，需要在此钩子函数执行
    var ss = viewModel.get("btnBatchDelete");
    ss.setVisible(false);
    viewModel.get("btnAdd").setVisible(false);
  });
});