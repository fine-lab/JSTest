viewModel.on("customInit", function (data) {
  //盘依赖关系信息--页面初始化
  const dependency = viewModel.getGridModel().getEditRowModel().get("moduleInfo_moduleDependencyList");
  const domainName = viewModel.getGridModel().getEditRowModel().get("domainInfo_domainName");
  // 模块依赖过滤
  dependency.on("beforeBrowse", function (data) {
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
  // 领域信息过滤
  domainName.on("beforeBrowse", function (data) {
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