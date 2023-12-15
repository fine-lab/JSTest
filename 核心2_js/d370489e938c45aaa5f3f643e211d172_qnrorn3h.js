viewModel.get("new2") &&
  viewModel.get("new2").on("beforeValueChange", function (data) {
    // 字段2--值改变前
  });
viewModel.get("new2") &&
  viewModel.get("new2").on("afterValueChange", function (data) {
    // 字段2--值改变后
    // 字段2--值改变后
    if (data.value == "2") {
      viewModel.get("btnSave").setDisabled(true);
    } else {
      viewModel.get("btnSave").setDisabled(false);
    }
  });
viewModel.get("ly_test_lingyu") &&
  viewModel.get("ly_test_lingyu").on("afterValueChange", function (data) {
    // 领域_测试(租户)--值改变后
  });
viewModel.get("ly_test_lingyu") &&
  viewModel.get("ly_test_lingyu").on("afterMount", function (data) {
    // 领域_测试(租户)--参照加载完成后
  });
viewModel.get("ly_test_lingyu") &&
  viewModel.get("ly_test_lingyu").on("afterReferOkClick", function (data) {
    // 领域_测试(租户)--参照弹窗确认按钮点击后
    debugger;
    var value = data[0].lingyu;
    if (value == "采购云") {
      alert("低级黑名单，请注意");
      viewModel.get("btnSave").setDisabled(false);
    } else if (value == "财务云") {
      alert("高级黑名单，无法保存！");
      viewModel.get("btnSave").setDisabled(true);
    } else {
      viewModel.get("btnSave").setDisabled(false);
    }
  });