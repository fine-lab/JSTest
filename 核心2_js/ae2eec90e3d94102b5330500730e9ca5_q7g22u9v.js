function qualificationSharingRelationship(event) {
  let viewModel = this;
  let businessType = viewModel.get("businessType"); //业务类型
  let qsOrgName = viewModel.get("qualificationSourcingOrganization_name"); //资质寻源组织名字
  let qsOrgId = viewModel.get("qualificationSourcingOrganization"); //资质寻源组织id
  let orgName = viewModel.get("org_id_name");
  let org_id = viewModel.get("org_id"); //认证共享组织
  let qsId = null; //资质寻源组织id
  let id = null; //资质共享组织id
  businessType.on("afterValueChange", function () {
    orgName.clear();
    org_id.clear();
    qsOrgName.clear();
    qsOrgId.clear();
    var result = unique();
    if (!result) {
      businessType.clear();
      return false;
    }
  });
  qsOrgName.on("afterValueChange", function (event) {
    var result = unique();
    if (!result) {
      qsOrgName.clear();
      qsOrgId.clear();
    }
  });
  //唯一性校验
  function unique() {
    var businessTypeValue = businessType.getValue();
    var qsOrgValue = viewModel.get("qualificationSourcingOrganization").getValue();
    if (typeof businessTypeValue == "undefined" || businessTypeValue === null || typeof qsOrgValue == "undefined" || qsOrgValue === null) {
      return true;
    } else {
      var respResult = cb.rest.invokeFunction("cad60f03588944caa4096c47ba447632", { businessTypeValue: businessTypeValue, qsOrgValue: qsOrgValue }, null, viewModel, { async: false });
      if (respResult.result.res.length !== 0) {
        if (businessTypeValue === "1") {
          businessTypeValue = "采购";
        } else {
          businessTypeValue = "销售";
        }
        cb.utils.alert(businessTypeValue + "业务类型+'资质寻源组织'且启用的数据已存在!");
        return false;
      }
    }
    return true;
  }
  // 弹窗下部按钮触发弹窗关闭
  viewModel.get("btnSave").on("click", function (event) {
    var cache = viewModel.get("cache");
    var parentViewModel = cache.parentViewModel;
    // 弹窗关闭
    parentViewModel.execute("refresh");
  });
  // 弹窗下部按钮触发弹窗关闭
  viewModel.get("btnAbandon").on("click", function (event) {
    var cache = viewModel.get("cache");
    var parentViewModel = cache.parentViewModel;
    parentViewModel.execute("refresh");
  });
}