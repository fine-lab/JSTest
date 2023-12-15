viewModel.on("customInit", function (data) {
  // 银行账号管理详情--页面初始化
  cb.rest.invokeFunction("GT34544AT7.staff.currentStaff", {}, function (err, res) {
    var maintain = res.GxsOrg;
    var baseOrg = res.sysOrg;
    viewModel.get("maintain").setVaue(maintain);
    viewModel.get("baseOrg").setVaue(baseOrg);
  });
});