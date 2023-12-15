viewModel.on("customInit", function (data) {
  // 班子换届详情--页面初始化
  var girdModel = viewModel.getGridModel();
  girdModel
    .getEditRowModel()
    .get("username_name")
    .on("beforeBrowse", function (data) {
      const value = viewModel.get("org_id").getValue();
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