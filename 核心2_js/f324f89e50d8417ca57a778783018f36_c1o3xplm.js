viewModel.on("customInit", function (data) {
  // 模态框列表--页面初始化
  debugger;
  // 接收参数
  var id = viewModel.getParams().productID;
  var name = viewModel.getParams().productNAME;
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("parentPartCode").getFromModel().setValue(id);
      filtervm.get("parentPartName").getFromModel().setValue(name);
    });
  });
});
viewModel.get("button6nk") &&
  viewModel.get("button6nk").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button10gh") &&
  viewModel.get("button10gh").on("click", function (data) {
    // 确认--单击
    debugger;
    var GridModel = viewModel.getGridModel();
    var RowGrid = GridModel.getSelectedRows();
    if (RowGrid.length > 0) {
      for (var i = 0; i < RowGrid.length; i++) {
        var amountSummary = RowGrid[i].amountSummary;
        var filterViewModel = viewModel.getCache("parentViewModel");
        var mainData = viewModel.getAllData();
        var row = viewModel.getParams().row;
        var grid = viewModel.getParams().grid;
        var gridModel = filterViewModel.getGridModel(grid);
        gridModel.setCellValue(row, "bodyFreeItem!define1", amountSummary);
        viewModel.communication({ type: "modal", payload: { data: false } });
      }
    } else {
      alert("请选择一条数据！");
    }
  });