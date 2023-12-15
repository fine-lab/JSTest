//页面DOM加载完成
viewModel.on("afterMount", function () {
  //获取查询区模型
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  //赋予查询区字段初始值
  filterViewModelInfo.get("jichushujumaishourenshenfenzhenghaoma").getFromModel().setValue("123");
});