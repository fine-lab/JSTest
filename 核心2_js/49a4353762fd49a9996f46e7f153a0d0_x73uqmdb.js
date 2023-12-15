viewModel.on("customInit", function (data) {
  viewModel.get("vendor_name").on("beforeBrowse", function () {
    // 实现品牌的过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "vendorApplyRange.org",
      op: "eq",
      value1: "1496752646311641092"
    });
    this.setFilter(condition);
  });
});