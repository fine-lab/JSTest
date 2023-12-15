viewModel.get("extendCustomer_MingChen") &&
  viewModel.get("extendCustomer_MingChen").on("beforeValueChange", function (data) {
    // 关联潜客--值改变前
    let cust = viewModel.get("extendCustomer").getValue();
    if (cust != null && cust != "") {
      cb.utils.alert("温馨提示，关联潜在客户已选定，不允许修改！", "error");
      return false;
    }
  });