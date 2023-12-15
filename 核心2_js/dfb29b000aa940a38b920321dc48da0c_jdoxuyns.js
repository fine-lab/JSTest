viewModel.get("item206fi") &&
  viewModel.get("item206fi").on("beforeValueChange", function (data) {
    // 文本框45--值改变前
    alert("helloworld");
  });
viewModel.get("wenben") &&
  viewModel.get("wenben").on("beforeValueChange", function (data) {
    // 文本--值改变前
    alert("1");
  });