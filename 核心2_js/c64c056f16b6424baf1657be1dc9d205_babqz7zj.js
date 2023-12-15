viewModel.on("customInit", function (data) {
  // 测试kw详情--页面初始化
  //卡片页面数据加载完成
  viewModel.on("afterLoadData", function () {
    console.log("[afterLoadData]");
    viewModel.get("name").setValue("测试");
    var data1 = viewModel.getData();
    data1.info = "描述XXXXXXXXXXX";
    viewModel.setData(data1);
    debugger;
  });
});
viewModel.get("button22li") &&
  viewModel.get("button22li").on("click", function (data) {
    // 跳转测试kw2--单击
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucher",
        billno: "7dd2dc64",
        params: {
          perData: "测试父页面数据传递"
        }
      },
      viewModel
    );
  });