viewModel.get("new1") &&
  viewModel.get("new1").on("beforeValueChange", function (data) {
    // 文本--值改变前
    alert("hahaha1");
  });