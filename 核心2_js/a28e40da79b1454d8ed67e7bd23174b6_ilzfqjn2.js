viewModel.on("afterEdit", function (args) {
  debugger;
  const data = viewModel.getAllData();
  viewModel.getGridModel().setCellState(0, "nsummny", "readOnly", true); //设置只读
});