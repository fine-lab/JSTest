const value = "香雪";
const res = str.replace("香雪123", value);
viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    // 合同名称--值改变前
    alert(res);
  });
viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    // 合同名称--值改变后
  });
viewModel.get("code") &&
  viewModel.get("code").on("beforeValueChange", function (data) {
    // 合同编码--值改变前
  });