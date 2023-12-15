viewModel.get("qpbm_name") &&
  viewModel.get("qpbm_name").on("afterValueChange", function (data) {
    // 签批部门--值改变后
    var qpbm = viewModel.get("qpbmCode").getValue();
    let optionAllXiShu = { async: false };
    let getOrg = cb.rest.invokeFunction("5710ec7f14054b1cbdb606ec82881298", { qpbm: qpbm }, null, viewModel, optionAllXiShu);
    if (getOrg.result.orgid) {
      var orgid = getOrg.result.orgid;
      var orgName = getOrg.result.orgName;
      viewModel.get("org").setValue(orgid);
      viewModel.get("org_name").setValue(orgName);
    }
    debugger;
  });