viewModel.get("childs") &&
  viewModel.get("childs").on("beforeCellValueChange", function (data) {
    // 报价订单信息数据区--单元格值改变前
  });
viewModel.get("childs") &&
  viewModel.get("childs").on("afterCellValueChange", function (data) {
    // 报价订单信息数据区--单元格值改变后
    const d = "1232";
    console.log(d);
  });