viewModel.get("new2") &&
  viewModel.get("new2").on("afterValueChange", function (data) {
    //字段2--值改变后
    viewModel.get("new3").setValue("test 333");
  });