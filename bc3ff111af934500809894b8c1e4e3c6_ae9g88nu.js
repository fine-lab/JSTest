run = function (event) {
  var viewModel = this;
  // 添加用户参照的组织过滤
  viewModel.get("recorder_name").on("beforeBrowse", function () {
    // 获取组织id
    let orgId = viewModel.get("org_id").getValue();
    let depId = viewModel.get("recorddep").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "mainJobList.org_id", //
      op: "eq",
      value1: orgId
    });
    if (depId != undefined) {
      condition.simpleVOs.push({
        field: "mainJobList.dept_id", //
        op: "eq",
        value1: depId
      });
    }
    this.setFilter(condition);
  });
  viewModel.get("recorder_name").on("afterValueChange", function (data) {
    let dep_id = viewModel.get("recorddep").getValue();
    if (data.value != null && dep_id == null && (data.oldValue == null || data.value.id != data.oldValue.id)) {
      viewModel.get("recorddep").setValue(data.value.dept_id);
      viewModel.get("recorddep_name").setValue(data.value.dept_id_name);
    }
  });
  viewModel.get("recorddep_name").on("afterValueChange", function (data) {
    if (data.value == undefined || (data.oldValue != undefined && data.value.id != data.oldValue.id)) {
      viewModel.get("recorder").setValue(null);
      viewModel.get("recorder_name").setValue(null);
    }
  });
};