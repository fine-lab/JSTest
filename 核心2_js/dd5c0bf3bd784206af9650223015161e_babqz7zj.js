viewModel.on("customInit", function (data) {
  // 测试kw2详情--页面初始化
  //卡片页面数据加载完成
  viewModel.on("afterLoadData", function () {
    console.log("[afterLoadData]");
    viewModel.get("title").setValue("测试");
    var data1 = viewModel.getData();
    data1.description = "描述XXXXXXXXXXX";
    viewModel.setData(data1);
    debugger;
  });
});