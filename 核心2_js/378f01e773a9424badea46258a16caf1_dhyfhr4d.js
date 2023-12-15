viewModel.on("customInit", function (data) {
  // 党务公开管理详情--页面初始化
  viewModel.get("username_name").on("beforeBrowse", function () {
    // 获取组织id
    const value = viewModel.get("org_id").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "org_id",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
});