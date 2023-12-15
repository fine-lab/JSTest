viewModel.on("customInit", function (data) {
  // 测试kw2详情--页面初始化
  console.log("1111111111" + data.perData);
  //卡片页面数据加载完成
  viewModel.on("afterLoadData", function () {
    console.log("[afterLoadData]");
    viewModel.get("title").setValue("测试2");
    var data1 = viewModel.getData();
    data1.description = "测试kw2详情--页面初始化描述XXXXXXXXXXX";
    viewModel.setData(data1);
    debugger;
  });
});
viewModel.get("button22te") &&
  viewModel.get("button22te").on("click", function (data) {
    // 跳转--单击
  });