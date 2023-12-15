viewModel.on("customInit", function (data) {
  // 物料货位对照--页面初始化
});
viewModel.on("afterMount", function () {
  const filtervm = viewModel.getCache("FilterViewModel");
  //查询区模型DOM初始化后
  filtervm.on("afterInit", function () {
    //赋予查询区字段初始值
    filtervm
      .get("baseOrg")
      .getFromModel()
      .on("beforeBrowse", function (data) {
        data.externalData = {
          noPermissionRequired: true
        };
      });
  });
});