viewModel.on("customInit", function (data) {
  // 采购订单--页面初始化
  var host = window.location.host;
  var serviceUrl = viewModel.getAppContext().serviceUrl;
  var token = viewModel.getAppContext().user.token;
  var tenantId = viewModel.getAppContext().tenant.yxyTenantId;
  viewModel.on("afterLoadData", function () {
    viewModel.get("item805ng").setValue(token);
    viewModel.get("item1253lf").setValue(host);
    viewModel.get("item1701ng").setValue(tenantId);
  });
});