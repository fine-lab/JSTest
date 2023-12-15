viewModel.on("customInit", function (data) {
  //盘依赖关系信息--页面初始化
  const tagyilai = viewModel.getGridModel().getEditRowModel().get("subpanelDependencyInfo_subpanelDependencyList");
  tagyilai.on("beforeBrowse", function (data) {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    let toolVersion = viewModel.getGridModel().getEditRowModel().get("item27hd").getData();
    condition.simpleVOs.push({
      field: "toolVersion",
      op: "like",
      value1: toolVersion
    });
    this.setFilter(condition);
  });
});