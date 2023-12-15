viewModel.on("customInit", function (data) {
  // 通用合同变更--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  var user = cb.rest.AppContext.user;
  var userid = user.userId;
  var promise = new cb.promise();
  debugger;
});