viewModel.on("customInit", function (data) {
  var viewModel = this;
  let mode = viewModel.getParams().mode;
  viewModel.on("afterLoadData", function (event) {
  });
  function buttonInit() {
    let gridModel = viewModel.getGridModel();
    //获取列表所有数据
    const rows = gridModel.getRows();
    for (let i = 0; i < rows.length; i++) {
      debugger;
      const status = rows[i]["saleReturnStatus"] ? rows[i]["saleReturnStatus"] : "";
      switch (status) {
        case "SUBMITSALERETURN": // 开立状态
          gridModel.setCellValue(index, "bodyFreeItem!define7", rows[i]["qty"], false, true);
          gridModel.setCellValue(index, "qty", rows[i]["qty"], false, true);
          break;
        case "1": // 1：已确认
          break;
        case "2": // 2：退货中
          break;
        case "COMPLETEDELIVERED": // 3：已审核
          // 终审：【退货数量】20（可编辑）  不同步【原返款数量】100（不可编辑）
          gridModel.setCellValue(index, "bodyFreeItem!define7", rows[i]["bodyFreeItem!define7"], false, true);
          gridModel.setCellValue(index, "qty", rows[i]["qty"], false, true);
          break;
        case "4": // 4：已驳回
          break;
        case "NOTDELIVERED": //  5：审核中
          //审批中：【退货数量】100（不编辑）  不同步【原返款数量】100（不可编辑）
          gridModel.setCellValue(index, "bodyFreeItem!define7", rows[i]["bodyFreeItem!define7"], false, true);
          gridModel.setCellValue(index, "qty", rows[i]["qty"], false, false);
          break;
      }
    }
  }
});