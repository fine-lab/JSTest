viewModel.on("customInit", function (data) {
  // 检测订单详情--页面初始化
  viewModel.on("afterLoadData", function (args) {
    var id = args.id;
    var result = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.selectById", { id: id }, function (err, res) {}, viewModel, { async: false });
    var end = new Date(result.result.res[0].planEffectiveEndDate).getTime();
    var now = new Date().getTime();
    debugger;
    if ("true" == result.result.res[0].isTakeEffect && end >= now) {
      viewModel.get("customer_name").setReadOnly(true);
      viewModel.get("customerType_name").setReadOnly(true);
      viewModel.get("planEffectiveDate").setReadOnly(true);
      viewModel.get("planEffectiveEndDate").setReadOnly(true);
    }
  });
  viewModel.getGridModel("planSalesFormList").on("beforeCellValueChange", function (params) {
    debugger;
    var rowIndex = params.rowIndex;
    var cellName = params.cellName;
    var value = params.value;
    if (cellName == "plannedAvailability") {
      var rowData = viewModel.getGridModel().getRow(rowIndex);
      if (value < rowData.executionQuantity) {
        cb.utils.alert("当前计划可供量小于订单执行量，请调整！");
      }
    }
  });
  viewModel.getGridModel("planSalesFormList").on("afterCellValueChange", function (params) {
    debugger;
    var rowIndex = params.rowIndex;
    var cellName = params.cellName;
    if (cellName == "plannedAvailability") {
      var rowData = viewModel.getGridModel().getRow(rowIndex);
      if (rowData.plannedAvailability >= rowData.executionQuantity) {
        var num = rowData.plannedAvailability - rowData.executionQuantity;
        if (undefined == rowData.plannedAvailability) {
          num = 0;
        }
        viewModel.getGridModel().setCellValue(rowIndex, "availableQuantity", num);
        viewModel.getGridModel().setCellValue(rowIndex, "overPlannedQuantity", 0);
      }
    }
  });
});
viewModel.on("beforeDeleteRow", function (args) {
  debugger;
  var data = viewModel.getGridModel().getRows()[args.data[0]];
  var id = data.salesPlan_id;
  var result = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.selectById", { id: id }, function (err, res) {}, viewModel, { async: false });
  var end = new Date(result.result.res[0].planEffectiveEndDate).getTime();
  var now = new Date().getTime();
  if ("true" == result.result.res[0].isTakeEffect && end >= now) {
    cb.utils.alert("已生效,无法删除,操作失败");
    return false;
  }
});
viewModel.on("beforeEdit", function (args) {
  debugger;
  var id = viewModel.getGridModel().getRows()[0].salesPlan_id;
  var result = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.selectById", { id: id }, function (err, res) {}, viewModel, { async: false });
  var end = new Date(result.result.res[0].planEffectiveEndDate).getTime();
  var now = new Date().getTime();
  if ("true" == result.result.res[0].isTakeEffect && end >= now) {
    cb.utils.alert("已生效,无法编辑,操作失败");
    return false;
  }
});
viewModel.on("beforeDelete", function (args) {
  debugger;
  var id = viewModel.getGridModel().getRows()[0].salesPlan_id;
  var result = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.selectById", { id: id }, function (err, res) {}, viewModel, { async: false });
});