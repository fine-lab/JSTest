viewModel.on("customInit", function (data) {
  viewModel.on("afterMount", function () {
    //通过filterRows字段控制查询区显示行数
    let filters = viewModel.getCache("FilterViewModel");
    filters.on("afterInit", function (data) {
      filters
        .get("emp_name")
        .getFromModel()
        .on("beforeBrowse", function () {
          let orgId = filters.get("org_id").getFromModel().getValue();
          if (orgId != undefined && orgId != null && orgId != "") {
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
          } else {
            let condition = {
              isExtend: true,
              simpleVOs: []
            };
            this.setFilter(condition);
          }
        });
    });
  });
});