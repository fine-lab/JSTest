viewModel.get("order_detail_h01List") &&
  viewModel.get("order_detail_h01List").on("afterCellValueChange", function (data) {
    // 表格-订单详情--单元格值改变后
    if (data.cellName != "total_money") {
      return;
    }
    let rows = viewModel.getGridModel().getRows();
    let total = 0;
    for (var i = rows.length - 1; i >= 0; i--) {
      let row = rows[i];
      if (row.num && row.money) {
        total += row.num * row.money;
      }
    }
    viewModel.get("money").setValue(total);
  });