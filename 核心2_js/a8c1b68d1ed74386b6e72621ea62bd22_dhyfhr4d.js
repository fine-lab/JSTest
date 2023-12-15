viewModel.get("year") &&
  viewModel.get("year").on("afterValueChange", function (data) {
    viewModel.get("month").setValue(data.value);
  });
viewModel.get("month") &&
  viewModel.get("month").on("beforeValueChange", function (data) {
    // 缴纳月份--值改变前
  });
viewModel.get("month") &&
  viewModel.get("month").on("afterValueChange", function (data) {
    // 缴纳月份--值改变后
  });
viewModel.on("customInit", function (data) {
  // 党费管理单卡--页面初始化
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