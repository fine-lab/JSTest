viewModel.on("customInit", function (data) {
  //订单1108--页面初始化
  let userid = cb.context.getUserId();
  console.log("===============>", userid);
  //当用户id=某个值是隐藏某个列 9a274cd9-95e8-489f-8dae-77283a9c158d
  if (userid == "9a274cd9-95e8-489f-8dae-77283a9c158d") {
    viewModel.getGridModel().setColumnState("code", "bHidden", true);
  }
});