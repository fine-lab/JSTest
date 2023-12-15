viewModel.on("customInit", function (data) {
  // 页面设计--页面初始化
  var girdModel = viewModel.getGridModel();
  // 获取
  viewModel.get("product_name").on("beforeBrowse", function () {
    // 获取当前编辑行的品牌字段值
    const value = viewModel.get("org_id").getValue();
    // 实现品牌的过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "productOrgs.orgId",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
});