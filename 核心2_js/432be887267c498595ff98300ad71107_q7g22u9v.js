function qualificationSharingRelationship(event) {
  var viewModel = this;
  var businessType = viewModel.get("businessType"); //业务类型
  var purchasingOrganizationName = viewModel.get("purchasingOrganization_name");
  var purchasingOrganization = viewModel.get("purchasingOrganization"); //采购组织
  var salesOrganizationName = viewModel.get("salesOrganization_name");
  var salesOrganization = viewModel.get("salesOrganization"); //销售组织
  var inventoryOrganizationName = viewModel.get("inventoryOrganization_name");
  var inventoryOrganization = viewModel.get("inventoryOrganization"); //库存组织
  var orgName = viewModel.get("org_id_name");
  var org_id = viewModel.get("org_id"); //认证共享组织
  businessType.on("afterValueChange", function () {
    purchasingOrganizationName.clear();
    purchasingOrganization.clear();
    salesOrganizationName.clear();
    salesOrganization.clear();
    inventoryOrganizationName.clear();
    inventoryOrganization.clear();
  });
  purchasingOrganizationName.on("afterValueChange", function (event) {
    var businessTypeValue = businessType.getValue();
    if (businessTypeValue === "1") {
      var poValue = purchasingOrganization.getValue();
      var orgValue = org_id.getValue();
      if (poValue && orgValue) {
        var prespResult = cb.rest.invokeFunction("cad60f03588944caa4096c47ba447632", { businessTypeValue: businessTypeValue, purchasingOrg: poValue, org: orgValue }, null, viewModel, {
          async: false
        });
        if (prespResult.result.res.length !== 0) {
          cb.utils.alert("采购类型下,该'采购组织'+'认证共享组织'数据已存在!");
          purchasingOrganizationName.clear();
          purchasingOrganization.clear();
          return false;
        }
      }
    }
  });
  salesOrganizationName.on("afterValueChange", function (event) {
    var businessTypeValue = businessType.getValue();
    if (businessType.getValue() === "2") {
      var sValue = salesOrganization.getValue();
      var orgValue = org_id.getValue();
      if (sValue && orgValue) {
        let srespResult = cb.rest.invokeFunction("cad60f03588944caa4096c47ba447632", { businessTypeValue: businessTypeValue, salesOrg: sValue, org: orgValue }, null, viewModel, { async: false });
        if (srespResult.result.res.length !== 0) {
          cb.utils.alert("销售类型下,该'销售组织'+'认证共享组织'数据已存在!");
          salesOrganizationName.clear();
          salesOrganization.clear();
          return false;
        }
      }
    }
  });
  inventoryOrganizationName.on("afterValueChange", function (event) {
    var businessTypeValue = businessType.getValue();
    if (businessType.getValue() === "4") {
      var iValue = inventoryOrganization.getValue();
      var orgValue = org_id.getValue();
      if (iValue && orgValue) {
        let irespResult = cb.rest.invokeFunction("cad60f03588944caa4096c47ba447632", { businessTypeValue: businessTypeValue, inventoryOrg: iValue, org: orgValue }, null, viewModel, { async: false });
        if (irespResult.result.res.length !== 0) {
          cb.utils.alert("内部交易类型下,该'库存组织'+'认证共享组织'数据已存在!");
          inventoryOrganizationName.clear();
          inventoryOrganization.clear();
          return false;
        }
      }
    }
  });
  // 弹窗下部按钮触发弹窗关闭
  viewModel.get("button9986ih").on("click", function (event) {
    // 弹窗关闭
    var cache = viewModel.get("cache");
    var parentViewModel = cache.parentViewModel;
    parentViewModel.execute("refresh");
    //刷新父页面
  });
  // 弹窗下部按钮触发弹窗关闭
  viewModel.get("button9986pe").on("click", function (event) {
  });
}