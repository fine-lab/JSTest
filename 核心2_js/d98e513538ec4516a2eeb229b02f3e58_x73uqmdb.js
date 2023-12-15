viewModel.on("beforeSearch", function (args) {
  debugger;
  args.isExtend = true;
  //通用检查查询条件
});
viewModel.getTreeModel().on("beforeLoad", (args) => {
  debugger;
  var myFilter = { isExtend: true, simpleVOs: [] };
  myFilter.simpleVOs.push({
    field: "new1",
    op: "eq",
    value1: "1"
  });
  viewModel.getTreeModel().setTreeFilter(myFilter);
});