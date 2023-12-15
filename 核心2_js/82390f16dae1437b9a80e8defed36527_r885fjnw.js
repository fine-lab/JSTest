viewModel.get("paymentDetailList") &&
  viewModel.get("paymentDetailList").on("afterCellValueChange", function (data) {
    // 表格-付款明细_eq--单元格值改变后
    if (data.cellName != "money") {
      return;
    }
    let rows = viewModel.getGridModel().getRows();
    let total = 0;
    for (var i = rows.length - 1; i >= 0; i--) {
      let row = rows[i];
      if (row.qty && row.price) {
        total += row.qty * row.price;
      }
    }
    viewModel.get("payMoney").setValue(total);
  });