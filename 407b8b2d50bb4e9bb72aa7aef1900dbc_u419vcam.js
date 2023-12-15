viewModel.on("customInit", function (data) {
  const moduleName = viewModel.getGridModel().getEditRowModel().get("moduleInfo_moduleName");
  // 领域信息过滤
  moduleName.on("beforeBrowse", function (data) {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    let toolVersion = viewModel.getGridModel().getEditRowModel().get("toolVersion").getData();
    condition.simpleVOs.push({
      field: "toolVersion",
      op: "like",
      value1: toolVersion
    });
    this.setFilter(condition);
  });
});