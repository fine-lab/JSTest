viewModel.on("customInit", function (data) {
  //顾问信息列表--页面初始化
});
viewModel.get("button13hi") &&
  viewModel.get("button13hi").on("click", function (data) {
    //测试--单击
    cb.rest.invokeFunction("AT17E908FC08280001.task.updateProCode", {}, function (err, res) {
      debugger;
    });
  });