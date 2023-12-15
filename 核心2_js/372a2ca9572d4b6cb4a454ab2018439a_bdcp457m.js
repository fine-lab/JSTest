viewModel.on("beforeAdd", function (args) {
  // 销售订单--页面初始化
  if (!cb.rest.AppContext.globalization.defaultOrg) {
    args.params.carryData = { salesOrgId_name: "", salesOrgId: "" };
  }
});