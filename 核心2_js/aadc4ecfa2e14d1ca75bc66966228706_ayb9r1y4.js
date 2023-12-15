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
  // 安装结算表详情--保存前校验
});
var gridModel = viewModel.getGridModel("installBillingDetailsList");
viewModel.get("supervisoryStaff_name").on("beforeBrowse", function (args) {
  // 监理人员--值改变前
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
viewModel.get("shifujisuanzhibaojin") &&
  viewModel.get("shifujisuanzhibaojin").on("afterValueChange", function (data) {
    // 是否扣质保金--值改变后
    debugger;
    let gridModel = viewModel.getGridModel();
    //获取列表所有数据
    const rows = gridModel.getRows();
    var size = rows.length;
    var count = size * 200;
    var state = data.value.value;
    if (state == "Y") {
    }
  });
viewModel.get("installBillingDetailsList") &&
  viewModel.get("installBillingDetailsList").on("afterCellValueChange", function (data) {
    //表格-安装结算表详情--单元格值改变后
    debugger;
    //获取改变的字段名;
    var cellName = data.cellName;
    //获取操作表下标
    var rowIndex = data.rowIndex;
    if (cellName == "productionWorkNumber_productionWorkNumber") {
      // 获取生产工号
      var productionWorkNumber = data.value.productionWorkNumber;
      // 获取生产工号id
      var productionWorkNumberId = data.value.id;
      var type = "1";
      // 调API函数
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
      // 获取合计金额
      var addAmount = result.result.addAmount;
      var gridModel = viewModel.getGridModel("installBillingDetailsList");
      gridModel.setCellValue(rowIndex, "jisuangongshi", formula);
      gridModel.setCellValue(rowIndex, "amountAdvanced", theTimeMoney);
      gridModel.setCellValue(rowIndex, "amountInTotal", addAmount);
    }
  });