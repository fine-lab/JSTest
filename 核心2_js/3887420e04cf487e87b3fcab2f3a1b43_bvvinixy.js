viewModel.on("customInit", function (data) {
  // 工艺卡详情--页面初始化
  var viewModel = this;
  const gridModelInfo = viewModel.getGridModel();
  // 根据启用/停用 过滤物料
  gridModelInfo
    .getEditRowModel()
    .get("wuliao_name")
    .on("beforeBrowse", function () {
      // 主要代码
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "productOrgs.stopstatus",
        op: "eq",
        value1: "false"
      });
      //设置过滤条件
      this.setFilter(condition);
    });
});