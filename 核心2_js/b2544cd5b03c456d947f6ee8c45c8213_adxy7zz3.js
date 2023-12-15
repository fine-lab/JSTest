viewModel.get("new1") &&
  viewModel.get("new1").on("beforeValueChange", function (data) {
    // 字段1--值改变前
    alert("11");
  });