viewModel.get("extendsjdpdytj") &&
  viewModel.get("extendsjdpdytj").on("afterValueChange", function (data) {
    // 商机判断条件--值改变后
    var selectCount = 0;
    if (data == undefined) {
      selectCount = 0;
    } else {
      if (data.value) {
        selectCount = data.value.length;
      } else {
        selectCount = data.length;
      }
    }
    viewModel.get("extendsjpd").setValue(selectCount > 2 ? "重点商机" : "一般商机");
  });
viewModel.get("extendsjdpdytj") &&
  viewModel.get("extendsjdpdytj").on("afterValueChange", function (data) {
    // 商机的判定条件--值改变后
  });
viewModel.get("button43tb") &&
  viewModel.get("button43tb").on("click", function (data) {
    // 按钮--单击
  });