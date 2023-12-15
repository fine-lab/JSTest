viewModel.on("customInit", function (data) {
  // 扫码零售详情--页面初始化
  viewModel.on("afterRule", function () {
    let data = viewModel.getAllData();
    console.log("data", JSON.stringify(data));
  });
});