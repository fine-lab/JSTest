viewModel.get("code") &&
  viewModel.get("code").on("beforeValueChange", function (data) {
    // 潜在客户编码--值改变前
    cb.utils.alert("温馨提示，编码自动带出，不可修改！", "info");
    return false;
  });