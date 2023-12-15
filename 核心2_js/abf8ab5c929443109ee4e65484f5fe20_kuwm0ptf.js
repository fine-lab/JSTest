viewModel.on("beforeSearch", function (args) {
  debugger;
  var userid = cb.context.getUserId(); // 用户id
  console.log(userid);
});