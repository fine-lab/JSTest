viewModel.get("new2") &&
  viewModel.get("new2").on("beforeValueChange", function (data) {
    //字段2--值改变前
    alert("111");
  });