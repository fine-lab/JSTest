viewModel.getGridModel().setPageSize(5000); //列表页面设置每页显示2000条数据
viewModel.getGridModel().setRowDraggable(true); //拖拽改变行顺序
viewModel.getGridModel().setState("showRowNo", true); //代码实现是否显示行序号
viewModel.on("afterMount", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  //通过filterRows字段控制查询区显示行数
  filterViewModelInfo.getParams().filterRows = 10;
});