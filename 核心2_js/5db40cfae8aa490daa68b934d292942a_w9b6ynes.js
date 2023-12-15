viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    debugger;
    //赋予查询区字段初始值
    filtervm.get("applyperson").getFromModel().setValue(cb.rest.AppContext.user.userName);
  });
});