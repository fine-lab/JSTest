viewModel.on("customInit", function (data) {
  // 开票申请单--页面初始化
});
viewModel.get("button19he") &&
  viewModel.get("button19he").on("click", function (data) {
    // 按钮--单击
    var user = cb.rest.AppContext.user;
    window.open("http://172.27.66.194/#/system/auth.html?username=2023804030");
    window.closeWin();
  });