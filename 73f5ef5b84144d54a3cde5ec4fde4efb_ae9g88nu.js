viewModel.on("customInit", function (data) {
  // 员工健康档案--页面初始化
  viewModel.get("note_taker_name").on("beforeBrowse", function (data) {
    let orgId = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: orgId
    });
    this.setFilter(condition);
  });
  var girdModel = viewModel.getGridModel();
  girdModel
    .getEditRowModel()
    .get("emp_name_name")
    .on("beforeBrowse", function () {
      let orgId = viewModel.get("org_id").getValue();
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "mainJobList.org_id",
        op: "eq",
        value1: orgId
      });
      this.setFilter(condition);
    });
});