viewModel.get("details_of_deduction_expensesList") &&
  viewModel.get("details_of_deduction_expensesList").on("afterInsertRow", function (data) {
    // 表格-抵扣费用明细--单元格值改变后
    viewModel.get("details_of_deduction_expensesList").on("afterCellValueChange", function (data1) {
      const rows = viewModel.get("details_of_deduction_expensesList").getRows();
      var amount = 0;
      rows.forEach((item, index) => {
        amount = amount + item.paid_in_amount_y;
      });
      viewModel.get("backmny").setData(amount);
    });
  });
viewModel.on("afterLoadData", function (data) {
  // 押金使用记录详情--页面初始化
  const flag = viewModel.get("bill_type").getValue();
  var gridModel = viewModel.get("details_of_deduction_expensesList");
  if (flag !== "1") {
    viewModel.execute("updateViewMeta", { code: "a1692ff1b2d943e4bcf53c641aa22a1b", visible: false });
  } else {
    viewModel.execute("updateViewMeta", { code: "a1692ff1b2d943e4bcf53c641aa22a1b", visible: true });
    gridModel.setColumnState("paid_in_amount_y", "bIsNull", false);
    gridModel.setColumnState("receivable_number_code", "bIsNull", false);
    viewModel.get("backmny").setDisabled(true);
  }
});