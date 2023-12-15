viewModel.get("item45kd_name") &&
  viewModel.get("item45kd_name").on("beforeBrowse", function (data) {
    // 参照框23--参照弹窗打开前
    var myFilter = { isExtend: true, simpleVOs: [] };
    myFilter.simpleVOs.push({
      field: "merchantAppliedDetail.specialManagementDep.name",
      op: "eq",
      value1: "总经办"
    });
    this.setFilter(myFilter);
  });
viewModel.get("item45kd_name") &&
  viewModel.get("item45kd_name").on("afterMount", function (data) {
    // 参照框23--参照加载完成后
  });
viewModel.get("button27lh") &&
  viewModel.get("button27lh").on("click", function (data) {
    // 弹框--单击
    var data = {
      billtype: "voucher",
      billno: "cff34347",
      params: {
        mode: "edit"
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel);
  });
viewModel.on("afterMount", function (data) {
  // 单卡详情--页面初始化
});
viewModel.on("customInit", function (data) {
  // 单卡详情--页面初始化
});