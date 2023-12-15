viewModel.on("customInit", function (data) {
  const subpanelName = viewModel.getGridModel().getEditRowModel().get("subpanelInfo_subpanelName");
  // 安装盘信息过滤
  subpanelName.on("beforeBrowse", function (data) {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    let toolVersion = viewModel.getGridModel().getEditRowModel().get("item28dj").getData();
    condition.simpleVOs.push({
      field: "toolVersion",
      op: "like",
      value1: toolVersion
    });
    this.setFilter(condition);
  });
});