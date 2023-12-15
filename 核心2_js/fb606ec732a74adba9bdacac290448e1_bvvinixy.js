viewModel.on("customInit", function (data) {
  // 人员排班行编辑--页面初始化
  viewModel.get("stopstatus").on("beforeBrowse", function (args) {
    //主要代码
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "work_center.stopstatus",
      op: "eq",
      value1: "false"
    });
    //设置过滤条件
    this.setFilter(condition);
  });
});