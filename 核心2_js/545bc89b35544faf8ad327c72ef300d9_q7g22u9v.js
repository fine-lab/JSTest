function qualificationSharingRelationship(event) {
  var viewModel = this;
  var cache = viewModel.get("cache");
  var parentViewModel = cache.parentViewModel;
  var businessType = viewModel.get("businessType"); //业务类型
  var qsOrgName = viewModel.get("qualificationSourcingOrganization_name"); //资质寻源组织名字
  var qsOrgId = viewModel.get("qualificationSourcingOrganization"); //资质寻源组织id
  var orgName = viewModel.get("org_id_name");
  var org_id = viewModel.get("org_id"); //认证共享组织
  businessType.on("afterValueChange", function () {
    var result = unique();
    if (!result) {
      qsOrgId.clear();
      return false;
    }
  });
  qsOrgName.on("afterValueChange", function (event) {
    var result = unique();
    if (!result) {
      qsOrgId.clear();
    }
  });
  orgName.on("afterValueChange", function (event) {
    var result = unique();
    if (!result) {
      org_id.clear();
    }
  });
  //唯一性校验
  function unique() {
    var businessTypeValue = businessType.getValue();
    var qsOrgValue = qsOrgId.getValue();
    var orgValue = org_id.getValue();
    if (typeof businessTypeValue == "undefined" || businessTypeValue === null || ((typeof orgValue == "undefined" || orgValue === null) && (typeof qsOrgValue == "undefined" || qsOrgValue === null))) {
      return true;
    } else {
      var respResult = cb.rest.invokeFunction("cad60f03588944caa4096c47ba447632", { businessTypeValue: businessTypeValue, qsOrgValue: qsOrgValue, org: orgValue }, null, viewModel, { async: false });
      if (respResult.result.res.length !== 0) {
        cb.utils.alert(businessType.getValue() + "业务类型下,'资质寻源组织'+'资质共享组织'的数据已存在!");
        qsOrgName.clear();
        qsOrgId.clear();
        return false;
      }
    }
  }
  // 弹窗下部按钮触发弹窗关闭
  viewModel.get("btnSave").on("click", function (event) {
    parentViewModel.execute("refresh");
  });
  // 弹窗下部按钮触发弹窗关闭
  viewModel.get("btnAbandon").on("click", function (event) {
    parentViewModel.execute("refresh");
  });
}