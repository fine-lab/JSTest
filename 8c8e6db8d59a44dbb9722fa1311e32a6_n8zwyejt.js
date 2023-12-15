viewModel.on("customInit", function (data) {
  viewModel.on("afterLoadData", function (args) {
    viewModel.on("modeChange", function (data) {
      let recheckMan = viewModel.get("claimer").getValue();
      if ((data === "add" || data === "edit") && (recheckMan == "" || recheckMan == null)) {
        //获取当前用户对应的员工，赋值给复核人员
        cb.rest.invokeFunction("GT22176AT10.publicFunction.getStaffOfCurUser", { mainOrgId: viewModel.get("org_id").getValue() }, function (err, res) {
          if (res != undefined && res.staffOfCurrentUser != undefined) {
            viewModel.get("claimer").setValue(res.staffOfCurrentUser.id);
            viewModel.get("claimer_name").setValue(res.staffOfCurrentUser.name);
            viewModel.get("claimdep").setValue(res.staffOfCurrentUser.deptId);
            viewModel.get("claimdep_name").setValue(res.staffOfCurrentUser.deptName);
          }
        });
      }
    });
  });
  viewModel.get("claimer_name").on("beforeBrowse", function () {
    // 获取组织id
    const value = viewModel.get("org_id").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
  viewModel.get("claimdep_name").on("beforeBrowse", function (data) {
    var externalData = {};
    externalData.ref_parentorgid = viewModel.get("org_id").getValue();
    (externalData.funcCode = "all"), (externalData.accountdelegate = "true"), viewModel.get("claimdep_name").setState("externalData", externalData);
  });
  //部门切换，或清空，清空验收员
  viewModel.get("claimdep_name").on("afterValueChange", function (data) {
    if (data.value == null || (data.oldValue != null && data.value.id != data.oldValue.id)) {
      viewModel.get("claimer").setValue(null);
      viewModel.get("claimer_name").setValue(null);
    }
  });
  //监督人
  viewModel.get("stockmanager_name").on("beforeBrowse", function () {
    // 获取组织id
    let value = viewModel.get("org_id").getValue();
    // 实现选择用户的组织id过滤
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
});