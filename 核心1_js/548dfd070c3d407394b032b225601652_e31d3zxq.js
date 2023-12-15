viewModel.on("customInit", function (data) {
  //仪器编码
  viewModel.get("instrumentCode_code").on("beforeBrowse", function (data) {
    let org_id = viewModel.get("org_id").getValue();
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "org_id",
      op: "eq",
      value1: org_id
    });
    this.setFilter(condition);
  });
});