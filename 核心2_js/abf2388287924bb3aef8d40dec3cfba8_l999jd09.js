viewModel.on("customInit", function (data) {
  // 机台任务看板新--页面初始化
  const treeModel = viewModel.getTreeModel();
  treeModel.on("beforeSetDataSource", function (data) {
    console.log(data);
    return true;
  });
});