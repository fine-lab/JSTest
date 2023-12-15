viewModel.on("customInit", function (data) {
  // 销售预订单详情--页面初始化
  viewModel.get("orderdate").setValue(fromatDate(new Date()));
});