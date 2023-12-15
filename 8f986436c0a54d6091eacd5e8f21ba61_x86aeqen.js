var treeModel = viewModel.getTreeModel(); //方法一、适用于页面中只有一个树表
treeModel.on("afterSelect", function (data) {
  debugger;
  viewModel.execute("updateViewMeta", {
    code: "groupcontainer18vf",
    visible: false
  });
  return true;
});