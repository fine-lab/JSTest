viewModel.on("customInit", function (data) {
  // 组织参照权限测试--页面初始化
  cb.rest.invokeFunction("GT101670AT8.api.getOrg", {}, function (err, res) {});
});