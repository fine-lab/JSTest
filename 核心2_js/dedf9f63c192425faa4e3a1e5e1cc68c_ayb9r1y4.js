viewModel.on("beforeSave", function (data) {
  // 安装结算表详情--保存前校验
});
viewModel.get("jianli_name").on("beforeBrowse", function (args) {
  debugger;
  let branch = viewModel.get("bumen").getValue();
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
viewModel.get("shedSettlementStatementDetailList") &&
  viewModel.get("shedSettlementStatementDetailList").on("afterCellValueChange", function (data) {
    //表格-搭棚结算表详情--单元格值改变后
    debugger;
    var cellName = data.cellName;
    if (cellName == "productionWorkNumber_productionWorkNumber") {
      var rowIndex = data.rowIndex;
      // 获取生产工号
      var productionWorkNumber = data.value.productionWorkNumber;
      // 获取生产工号id
      var productionWorkNumberId = data.value.id;
      var type = "3";
      // 根据生产工号Id查询任务下达单子表
      var result = cb.rest.invokeFunction(
        "GT102917AT3.API.summary",
        { productionWorkNumber: productionWorkNumber, productionWorkNumberId: productionWorkNumberId, type: type },
        function (err, res) {},
        viewModel,
        { async: false }
      );
      // 获取计算公式
      var formula = result.result.formula;
      // 获取已预支金额
      var theTimeMoney = result.result.theTimeMoney;
      var gridModel = viewModel.getGridModel("shedSettlementStatementDetailList");
      gridModel.setCellValue(rowIndex, "amountAdvanced", theTimeMoney);
    }
  });