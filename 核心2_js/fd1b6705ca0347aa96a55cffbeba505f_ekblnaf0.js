viewModel.on("customInit", function (data) {
  // 员工信息--页面初始化
  console.log(222);
});
viewModel.get("qq") &&
  viewModel.get("qq").on("afterValueChange", function (data) {
    console.log(1111);
  });