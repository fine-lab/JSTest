viewModel.get("button30xg") &&
  viewModel.get("button30xg").on("click", function (data) {
    // 提交到移动端2--单击
  });
viewModel.get("testMoveChildList") &&
  viewModel.get("testMoveChildList").on("afterCellValueChange", function (data) {
    // 表格-测试移动端子表--单元格值改变后
    console.log(data, "ddddddddddddd");
  });