viewModel.on("customInit", function (data) {
  // 枚举档案维护--页面初始化
  let userid = cb.context.getUserId();
  console.log("userid:" + userid);
});