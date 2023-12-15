viewModel.on("customInit", function (data) {
  const groupName = viewModel.getGridModel().getEditRowModel().get("resourceGroupExt_groupName");
  const subpanelName = viewModel.getGridModel().getEditRowModel().get("subpanelInfo_subpanelName");
  // 额外计算资源组信息过滤
  groupName.on("beforeBrowse", function (data) {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    let toolVersion = viewModel.getGridModel().getEditRowModel().get("item74qj").getData();
    condition.simpleVOs.push({
      field: "toolVersion",
      op: "like",
      value1: toolVersion
    });
    this.setFilter(condition);
  });
  // 安装盘信息过滤
});