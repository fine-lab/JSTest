viewModel.on("customInit", function (data) {
  //订单1108一主多子--页面初始化
});
viewModel.on("afterMount", function (args) {
  let userid = cb.context.getUserId();
  console.log("===============>", userid);
  //当用户id=某个值是隐藏某个页签9a274cd9-95e8-489f-8dae-77283a9c158d
});
viewModel.on("beforeSave", function (args) {
  let user = viewModel.get("user");
  console.log("====>", user);
  if (user.getValue() == "11") {
    cb.utils.alert("用户为11,已存在", "error");
    return false;
  }
});