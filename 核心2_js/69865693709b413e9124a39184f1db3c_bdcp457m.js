viewModel.on("beforeAdd", function (args) {
  // 订单列表--页面初始化
  if (!cb.rest.AppContext.globalization.defaultOrg) {
    args.params.carryData = { salesOrgId_name: "", salesOrgId: "" };
  }
});