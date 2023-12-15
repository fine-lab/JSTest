viewModel.get("stu_1628010463262408712") &&
  viewModel.get("stu_1628010463262408712").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    console.log("设置数据源前======================>");
  });
viewModel.get("stu_1628010463262408712") &&
  viewModel.get("stu_1628010463262408712").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    console.log("设置数据源前======================>");
  });
viewModel.on("customInit", function (data) {
  // 学生信息0103--页面初始化
  console.log("页面初始化后======================>");
});