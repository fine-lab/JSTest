viewModel.get("sys_verifystate") &&
  viewModel.get("sys_verifystate").on("beforeValueChange", function (data) {
    // 审批状态枚举--值改变前
    alert("hello");
  });