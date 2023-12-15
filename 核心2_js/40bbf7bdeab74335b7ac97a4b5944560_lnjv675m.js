viewModel.get("button24pi") &&
  viewModel.get("button24pi").on("click", function (data) {
    // 测试--单击
    let yhtUserId = "yourIdHere";
    let result = cb.rest.invokeFunction("GT9912AT31.common.queryTree", { yhtUserId }, function (err, res) {}, viewModel, { async: false });
    console.log(result);
  });
viewModel.get("button49bd") &&
  viewModel.get("button49bd").on("click", function (data) {
    // 主组织权限--单击
    let yhtUserId = "yourIdHere";
    let serviceCode = "1728814436602871815";
    let tenantId = "yourIdHere";
    let result = cb.rest.invokeFunction("GT9912AT31.auth.queryMainOrgs", { yhtUserId, serviceCode, tenantId }, function (err, res) {}, viewModel, { async: false });
    console.log(result);
  });