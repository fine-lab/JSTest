viewModel.get("target_transCustomer") &&
  viewModel.get("target_transCustomer").on("afterValueChange", function (data) {
    // 转化为客户--值改变后
  });
viewModel.get("target_transCustomer") &&
  viewModel.get("target_transCustomer").on("beforeSelect", function (data) {
    // 转化为客户--选择前
  });
viewModel.get("button58pb") &&
  viewModel.get("button58pb").on("click", function (data) {
    //督办--单击
    debugger;
    var data = JSON.parse(data);
  });