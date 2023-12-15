viewModel.get("detailsOfLiftingStatementList") &&
  viewModel.get("detailsOfLiftingStatementList").on("afterCellValueChange", function (data) {
    // 表格-吊装结算表详情--单元格值改变后
    //判断改变的值是否是生产工号
    debugger;
    //获取操作表下标
    var rowIndex = data.rowIndex;
    if (data.cellName == "productionWorkNumber_productionWorkNumber") {
      // 获取生产工号
      var productionWorkNumber = data.value.productionWorkNumber;
      // 获取生产工号id
      var productionWorkNumberId = data.value.id;
      var type = "2";
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
      //获取表格行模型
      var detailsOfLiftingStatementList = viewModel.get("detailsOfLiftingStatementList");
      detailsOfLiftingStatementList.setCellValue(rowIndex, "amountAdvanced", theTimeMoney);
      detailsOfLiftingStatementList.setCellValue(rowIndex, "settlementAmount", addAmount);
    }
  });
// 页面状态
var modeChange = "";
viewModel.on("beforeSave", function (data) {
  // 安装结算表详情--保存前校验
  debugger;
  if (modeChange != "edit") {
    var data = data.data.data;
    var ss = JSON.parse(data);
    var detailsOfLiftingStatementList = ss.detailsOfLiftingStatementList;
    if (ss.hasOwnProperty("detailsOfLiftingStatementList")) {
      for (var i = 0; i < detailsOfLiftingStatementList.length; i++) {
        var data1 = detailsOfLiftingStatementList[i];
        // 生产工号id
        var productionWorkNumber = data1.productionWorkNumber;
        // 生产工号
        var productionWorkNumber_productionWorkNumber = data1.productionWorkNumber_productionWorkNumber;
        var res = cb.rest.invokeFunction(
          "GT102917AT3.API.judgeexist",
          { productionWorkNumber: productionWorkNumber, productionWorkNumber_productionWorkNumber: productionWorkNumber_productionWorkNumber, advanceType: 2 },
          function (err, res) {},
          viewModel,
          { async: false }
        );
        var massage = res.result.massage;
        if (massage != "") {
          cb.utils.alert(massage);
          return false;
        }
      }
    }
  }
});
viewModel.on("modeChange", function (param) {
  modeChange = param;
  debugger;
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