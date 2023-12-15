viewModel.get("rc_vfinance_detailsList") &&
  viewModel.get("rc_vfinance_detailsList").on("beforeSetDataSource", function (data) {
    // 表格-凭证融资明细--设置数据源前
  });
viewModel.get("rc_vfinance_detailsList") &&
  viewModel.get("rc_vfinance_detailsList").on("afterSetDataSource", function (data) {
    // 表格-凭证融资明细--设置数据源后
  });
viewModel.get("rc_vfinance_detailsList") &&
  viewModel.get("rc_vfinance_detailsList").on("afterCellValueChange", function (data) {
    // 表格-凭证融资明细--单元格值改变后
    // 计算融资金额
    const list = viewModel.getGridModel("rc_vfinance_detailsList").getRows();
    let count = 0;
    list.forEach((item) => {
      count += item["item1161fc"];
    });
    viewModel.get("amount").setValue(count);
  });