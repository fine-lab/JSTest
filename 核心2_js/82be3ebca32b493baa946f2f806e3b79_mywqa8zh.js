viewModel.get("agetid_name").on("beforeBrowse", function (data) {
  // 销售订单详情--页面初始化
  // 获取当前编辑行的品牌字段值
  const value = viewModel.get("saleOrgid").getValue();
  // 实现品牌的过滤
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "merchantApplyRanges.orgId",
    op: "eq",
    value1: value
  });
  this.setFilter(condition);
});
viewModel.get("saleOrgid_name") &&
  viewModel.get("saleOrgid_name").on("afterValueChange", function (data) {
    // 销售组织--值改变后
  });
viewModel.on("customInit", function (data) {
  // 销售订单详情--页面初始化
});
//保存前
viewModel.on("beforeSave", function (args) {
  debugger;
  let returnRes = cb.rest.invokeFunction("GT105208AT4.desfun.tttt", {}, function (err, res) {}, viewModel, { async: false });
  cb.utils.alert(returnRes);
});