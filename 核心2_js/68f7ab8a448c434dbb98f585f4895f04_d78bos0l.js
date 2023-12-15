viewModel.get("voucher_orderlist") &&
  viewModel.get("voucher_orderlist").on("afterSelect", function (data) {
    // 订单列表区域--选择后
    debugger;
    var num = viewModel.getGridModel().getSelectedRowIndexes();
  });