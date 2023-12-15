viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    viewModel.get("控件编码").setValue("赋值内容");
  });