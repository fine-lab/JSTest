viewModel.on("customInit", function (data) {
  // 移动登录详情--页面初始化
  console.log("=================");
  let app = cb.utils.getUser("developerplatform");
  let tenant = cb.rest.AppContext.tenant;
  console.log(app);
  console.log(tenant);
});