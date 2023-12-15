viewModel.get("details_of_deduction_expensesList") &&
  viewModel.get("details_of_deduction_expensesList").on("afterInsertRow", function (data) {
    // 表格-抵扣费用明细--单元格值改变后
    viewModel
      .get("details_of_deduction_expensesList")
      .getEditRowModel()
      .get("receivable_number_code")
      .on("afterValueChange", function (data1) {
        const rows = viewModel.get("details_of_deduction_expensesList").getRows();
        var amount = 0;
        rows.forEach((item, index) => {
          amount = amount + item.outstanding_amount_y;
        });
        viewModel.get("backmny").setData(amount);
      });
  });
viewModel.on("afterLoadData", function (data) {
  // 押金使用记录详情--页面初始化
  const flag = viewModel.get("bill_type").getValue();
  var gridModel = viewModel.get("details_of_deduction_expensesList");
  if (flag !== "1") {
    viewModel.execute("updateViewMeta", { code: "79529ab8f53948d98510fa41decd0856", visible: false });
  } else {
    viewModel.execute("updateViewMeta", { code: "79529ab8f53948d98510fa41decd0856", visible: true });
  }
});