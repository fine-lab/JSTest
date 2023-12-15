viewModel.on("customInit", function (data) {
  // 机台任务详情--页面初始化
  let gridModelInfo = viewModel.getGridModel("718864a67f26416e90d6bbfdbfceb046");
  // 根据组织过滤物料
  gridModelInfo
    .getEditRowModel()
    .get("Product_name")
    .on("beforeBrowse", function () {
      //主要代码
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "productOrgs.stopstatus",
        op: "eq",
        value1: true
      });
      //设置过滤条件
      this.setFilter(condition);
    });
});