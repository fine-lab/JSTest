viewModel.get("button23ea") &&
  viewModel.get("button23ea").on("click", function (data) {
    // 保存为草稿--单击
  });
viewModel.on("customInit", function (data) {
  // 销售订单详情--页面初始化
  var viewModel = this;
  var girdModel = viewModel.getGridModel();
  // 获取
  viewModel.get("Merchant_belongOrg").on("beforeBrowse", function () {
    // 获取当前编辑行的品牌字段值
    const value = viewModel.get("sorg").getValue();
    // 实现品牌的
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "merchantAppliedDetail.belongOrg",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
});