viewModel.get("BasicInformationDetailsList") &&
  viewModel.get("BasicInformationDetailsList").getEditRowModel() &&
  viewModel.get("BasicInformationDetailsList").getEditRowModel().get("Productionworknumber") &&
  viewModel
    .get("BasicInformationDetailsList")
    .getEditRowModel()
    .get("Productionworknumber")
    .on("valueChange", function (data) {
      // 生产工号--值改变
    });
viewModel.get("qualitySafetyInspectionList") &&
  viewModel.get("qualitySafetyInspectionList").on("afterCellValueChange", function (data) {
    // 表格-质量安全检查--单元格值改变后
    var gridModel = viewModel.getGridModel("qualitySafetyInspectionList");
    var rowIndex = data.rowIndex;
    //获取下标
    for (var i = 0; i < rowIndex; i++) {
      gridModel.setRowState(i, "disabled", true);
    }
  });
viewModel.on("modeChange", function (data) {
  // 安装合同详情--页面初始化
  if (data == "edit") {
    var gridModel = viewModel.getGridModel("qualitySafetyInspectionList");
    var num = gridModel.__data.rows.length;
    for (var i = 0; i < num - 1; i++) {
      gridModel.setRowState(i, "disabled", true);
    }
  }
});
viewModel.on("customInit", function (data) {
  // 安装合同详情--页面初始化
  debugger;
  var tt = cb.rest.invokeFunction("GT102917AT3.API.queryid", {}, function (err, res) {}, viewModel, { async: false });
  var data = tt.result.ss.data;
  viewModel.get("Acceptance_date").setState("bCanModify", false);
  viewModel.get("ProjectName").setVisible(false);
  viewModel.get("dizhi").setVisible(false);
  viewModel.get("ziduan6").setVisible(false);
  viewModel.get("PartyA").setVisible(true);
});