viewModel.on("afterMount", function (data) {
  // 主子test详情--页面初始化
  let data1 = this.get("datatest_childList").getAllData();
  console.log(data1);
});
viewModel.get("button27pj") &&
  viewModel.get("button27pj").on("click", function (data) {
    // 赋值--单击
    let data1 = viewModel.getAllData();
    data1.name = "change";
    console.log(data1);
    viewModel.setValue(data1);
  });