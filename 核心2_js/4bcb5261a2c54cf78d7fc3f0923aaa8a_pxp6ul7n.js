viewModel.get("new3") &&
  viewModel.get("new3").on("beforeValueChange", function (data) {
    // 字段3--值改变前
    alert("d");
  });