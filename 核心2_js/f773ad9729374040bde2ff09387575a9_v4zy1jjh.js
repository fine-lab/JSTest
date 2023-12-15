viewModel.get("xsbjmmyList") &&
  viewModel.get("xsbjmmyList").on("afterCellValueChange", function (data) {
    // 表格-报价明细表--单元格值改变后
    viewModel.get("nip").setValue("s754");
  });