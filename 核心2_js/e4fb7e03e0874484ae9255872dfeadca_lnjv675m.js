viewModel.get("goodHistoryList") &&
  viewModel.get("goodHistoryList").on("beforeCellValueChange", function (data) {
    // 表格-购买记录--单元格值改变前
  });
viewModel.get("goodHistoryList") &&
  viewModel.get("goodHistoryList").on("afterCellValueChange", function (data) {
    // 表格-购买记录--单元格值改变后
    console.log("123");
  });
viewModel.get("button28tj") &&
  viewModel.get("button28tj").on("click", function (data) {
    // 修改数量--单击
    cb.utils.confirm(
      "请输入数量",
      () => {
      },
      () => {
      }
    );
  });