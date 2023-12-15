viewModel.on("customInit", function (data) {
  // 日志记录详情--页面初始化
});
viewModel.get("button19qh") &&
  viewModel.get("button19qh").on("click", function (data) {
    // 按钮--单击
    console.log(1);
    cb.rest.invokeFunction("GT65292AT10.backDefaultGroup.queryRoleV2", { userId: "1", tenantId: "2" }, function (err, res) {
      console.log(err, res);
    });
  });