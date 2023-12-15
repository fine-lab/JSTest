viewModel.get("respon_person_name") &&
  viewModel.get("respon_person_name").on("beforeValueChange", function (data) {
    // 负责人--值改变前
  });
viewModel.get("respon_person_name") &&
  viewModel.get("respon_person_name").on("afterValueChange", function (data) {
    // 负责人--值改变后
  });
viewModel.on("customInit", function (data) {
  // 客户详情--页面初始化
});