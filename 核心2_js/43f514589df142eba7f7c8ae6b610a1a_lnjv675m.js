viewModel.on("customInit", function (data) {
  // 门店零售详情--页面初始化
  viewModel.on("afterSave", function (data) {
    //保存后事件
    console.log("data", JSON.stringify(data));
  });
});