viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    debugger;
    var value = viewModel.get("org_id_name").getValue();
    cb.utils.alert(value);
    viewModel.get("org_id_name").on("beforeBrowse", function () {
      const value = viewModel.get("createOrgId").getValue();
      cb.utils.alert("123456");
      // 实现过滤
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      //分包合同详情下的分包合同号
      condition.simpleVOs.push({
        field: "subcontract_id",
        op: "eq",
        value1: value
      });
      this.setFilter(condition);
    });
  });