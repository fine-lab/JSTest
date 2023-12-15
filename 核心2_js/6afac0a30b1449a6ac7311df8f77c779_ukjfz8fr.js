viewModel.get("button46oj") &&
  viewModel.get("button46oj").on("click", function (data) {
    // 删除--单击
    console.log("删除--单击");
    //获取表格数据模型
    var gridModel = viewModel.get("ProductContentList");
    //获取选中行号
    var indexes = gridModel.getSelectedRowIndexes();
    if (indexes != null && indexes.length > 0) {
      gridModel.deleteRows(indexes);
    }
  });
viewModel.get("button75pa") &&
  viewModel.get("button75pa").on("click", function (data) {
    // 新增--单击
    console.log("新增--单击");
    //获取表格数据模型
    var gridModel = viewModel.get("ProductContentList");
    if (gridModel == undefined) {
      gridModel = viewModel.get("table117dd");
    }
    if (gridModel == undefined) {
      gridModel = viewModel.getGridModel()[3];
    }
    if (gridModel != undefined) {
      var rowData = {};
      gridModel.appendRow(rowData);
    } else {
      console.log("没有查找到表格对象");
    }
  });