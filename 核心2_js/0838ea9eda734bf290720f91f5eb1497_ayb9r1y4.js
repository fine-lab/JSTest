viewModel.get("additionalStatementDetailsList") &&
  viewModel.get("additionalStatementDetailsList").on("afterCellValueChange", function (data) {
    // 表格-附加结算表详情--单元格值改变后
    //获取改变的字段名;
    var cellName = data.cellName;
    //获取操作表下标
    var rowIndex = data.rowIndex;
    if (data.cellName == "productionWorkNumber_productionWorkNumber") {
      // 获取生产工号
      var productionWorkNumber = data.value.productionWorkNumber;
      // 获取生产工号id
      var productionWorkNumberId = data.value.id;
      var type = "4";
      // 调API函数
      // 根据生产工号Id查询任务下达单子表
      var result = cb.rest.invokeFunction(
        "GT102917AT3.API.summary",
        { productionWorkNumber: productionWorkNumber, productionWorkNumberId: productionWorkNumberId, type: type },
        function (err, res) {},
        viewModel,
        { async: false }
      );
      // 获取已预支金额
      var theTimeMoney = result.result.theTimeMoney;
      var gridModel = viewModel.getGridModel("additionalStatementDetailsList");
      gridModel.setCellValue(rowIndex, "amountAdvanced", theTimeMoney);
    }
  });
viewModel.get("contractNumber_subcontractNo") &&
  viewModel.get("contractNumber_subcontractNo").on("afterValueChange", function (data) {
    // 合同号--值改变后
    //改变后清除所有行
    var gridModel = viewModel.getGridModel();
    var value = data.value;
    var old = data;
    if (value == null) {
      gridModel.deleteAllRows();
    }
    if (old.hasOwnProperty("oldValue")) {
      gridModel.deleteAllRows();
    }
  });
viewModel.on("beforeSave", function (data) {
});
viewModel.get("branch") &&
  viewModel.get("branch").on("afterValueChange", function (data) {
    // 分科--值改变后
    viewModel = viewModel;
    debugger;
  });
viewModel.get("supervisoryStaff_name").on("beforeBrowse", function (args) {
  debugger;
  let branch = viewModel.get("branch").getValue();
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "mainJobList.dept_id",
    op: "eq",
    value1: branch
  });
  let ad = ["科长", "队长"];
  condition.simpleVOs.push({
    field: " mainJobList.post_id.name",
    op: "in",
    value1: ad
  });
  this.setFilter(condition);
});