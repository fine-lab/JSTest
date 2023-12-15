viewModel.on("afterLoadData", function (data) {
  // 上游单据--页面初始化
});
viewModel.on("customInit", function (data) {
  // 上游单据--页面初始化
  var treemodel = viewModel.getTreeModel();
  treemodel.setState("showCheckBox", true);
  treemodel.setState("multiple", true);
});