viewModel.get("extendcgf_name") &&
  viewModel.get("extendcgf_name").on("beforeBrowse", function (data) {
    // 采购方名称--参照弹窗打开前
    let orgName = viewModel.get("org_name").getValue();
    let condition = { isExtend: true, simpleVOs: [] };
    let op = "eq";
    condition.simpleVOs.push({
      field: "name",
      op: op,
      value1: orgName
    });
    this.setFilter(condition);
  });
viewModel.get("btnQueryStock") &&
  viewModel.get("btnQueryStock").on("click", function (data) {
    // 清空已验货--单击
    debugger;
    let rolesRest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getUsrRoles", {}, function (err, res) {}, viewModel, { async: false });
    let roleResObj = rolesRest.result;
    if (roleResObj.admin === true || roleResObj.chkrst) {
    }
  });