viewModel.on("afterLoadMeta", (args) => {
  const { vm, view } = args;
  console.log("%c afterLoadMeta   fired", "color: orange");
  cb.cache.set("viewModel", vm);
});
viewModel.getGridModel("voucher_orderlist").on("afterSetDataSource", (args) => {
  debugger;
});
viewModel.get("button64vg") &&
  viewModel.get("button64vg").on("click", function (data) {
    // 测试NCC完整数据--单击
    debugger;
  });