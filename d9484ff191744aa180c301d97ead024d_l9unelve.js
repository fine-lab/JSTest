viewModel.get("name") &&
  viewModel.get("name").on("blur", function (data) {
    //分类名称--失去焦点的回调
    let aa = viewModel.get("name").getValue();
    viewModel.get("remark").setValue(aa);
  });