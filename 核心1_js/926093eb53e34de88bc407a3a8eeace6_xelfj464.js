//设置模型上value的值
//参数data
viewModel.on("afterLoadData", function (args) {
  //给日期字段赋值
  viewModel.get("riqi").setData("2022-01-01");
});
//获取当前模型上的value的值
viewModel.on("afterLoadData", function (args) {
  viewModel.get("wenben").getValue();
});
viewModel.on("afterLoadData", function () {
  viewModel.getGridModel().getData();
});