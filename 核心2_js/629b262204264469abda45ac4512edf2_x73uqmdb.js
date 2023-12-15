viewModel.on("customInit", function (data) {
  // 主子页面详情--页面初始化
});
let gridModel = viewModel.getGridModel();
viewModel.get("new1").on("afterValueChange", function (data) {
  debugger;
  if (data.value == 1) {
    gridModel.setState("bIsNull", true);
  }
});
viewModel.get("button27ff") &&
  viewModel.get("button27ff").on("click", function (data) {
    // 按钮--单击
    let gridModel = viewModel.getGridModel();
    let rows = gridModel.getRows();
    rows.forEach((item, index) => {
      item.new1 = "222";
    });
    gridModel.updateRow(0, rows[0]);
  });