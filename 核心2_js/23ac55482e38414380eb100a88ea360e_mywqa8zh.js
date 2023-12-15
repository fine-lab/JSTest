viewModel.get("mujianbianma_name") &&
  viewModel.get("mujianbianma_name").on("afterValueChange", function (data) {
    // 母件编码--值改变后
    debugger;
    // 改变后清除所有行
    var gridModel = viewModel.getGridModel();
    var value = data.value;
    var old = data.oldValue;
    if (value == null) {
      gridModel.deleteAllRows();
    }
    var grid = viewModel.getGridModel("salesOrderDetiyList");
    var id = data.value.id;
    var tt = cb.rest.invokeFunction("GT7682AT32.API.querySun", { id: id }, function (err, res) {}, viewModel, { async: false });
    if (tt.result.array != undefined) {
      for (var i = 0; i < tt.result.array.length; i++) {
        grid.appendRow(tt.result.array[i]);
      }
    }
  });
viewModel.get("salesOrderDetiyList") &&
  viewModel.get("salesOrderDetiyList").on("afterCellValueChange", function (data) {
    // 表格-销售订单详情--单元格值改变后
    var list = viewModel.getGridModel("salesOrderDetiyList");
    if (data.cellName == "zijianshuliang") {
      var number = data.value;
      list.getCellvalue(0, "zijianshuliang");
    }
    if (data.cellName == "danjia") {
    }
  });
viewModel.get("salesOrderDetiyList") &&
  viewModel.get("salesOrderDetiyList").getEditRowModel() &&
  viewModel.get("salesOrderDetiyList").getEditRowModel().get("zijianbianma_name") &&
  viewModel
    .get("salesOrderDetiyList")
    .getEditRowModel()
    .get("zijianbianma_name")
    .on("afterValueChange", function (data) {
      // 子件编码--值改变
      debugger;
    });
viewModel.get("salesOrderDetiyList") &&
  viewModel.get("salesOrderDetiyList").getEditRowModel() &&
  viewModel.get("salesOrderDetiyList").getEditRowModel().get("danjia") &&
  viewModel
    .get("salesOrderDetiyList")
    .getEditRowModel()
    .get("danjia")
    .on("afterValueChange", function (data) {
      // 单价--值改变
      debugger;
    });
viewModel.on("customInit", function (data) {
  // 销售订单详情--页面初始化
  //获取行数据
  var asd = cb.rest.invokeFunction("GT7682AT32.API.CeShi", {}, function (err, res) {}, viewModel, { async: false });
  debugger;
});
viewModel.get("salesOrderDetiyList") &&
  viewModel.get("salesOrderDetiyList").getEditRowModel() &&
  viewModel.get("salesOrderDetiyList").getEditRowModel().get("danjia") &&
  viewModel
    .get("salesOrderDetiyList")
    .getEditRowModel()
    .get("danjia")
    .on("blur", function (data) {
      // 单价--失去焦点的回调
      debugger;
    });
viewModel.get("salesOrderDetiyList") &&
  viewModel.get("salesOrderDetiyList").on("afterSelect", function (data) {
    // 表格-销售订单详情--选择后
    debugger;
    const rows = viewModel.getRows();
  });
viewModel.get("button51bh") &&
  viewModel.get("button51bh").on("click", function (data) {
    // 按钮--单击
    debugger;
    const rows = viewModel.getGridModel().getRows();
  });