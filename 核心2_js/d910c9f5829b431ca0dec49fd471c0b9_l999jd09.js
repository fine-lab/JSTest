viewModel.on("customInit", function (data) {
  // 工作中心--页面初始化
  // 添加用户参照的组织过滤
  viewModel.get("extendProcedure_name").on("beforeBrowse", function () {
    // 获取组织id
    const value = viewModel.get("orgId").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "orgId",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
});