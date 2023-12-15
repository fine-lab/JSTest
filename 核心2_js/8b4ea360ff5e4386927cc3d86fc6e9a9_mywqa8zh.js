viewModel.get("button1bd") &&
  viewModel.get("button1bd").on("click", function (data) {
    // 取消--单击
    var parentViewModel = viewModel.getCache("parentViewModel"); //获取到父model
    parentViewModel.setReadOnly(true); //设置页面不允许编辑
    parentViewModel.get("btnSaveAndAdd").setDisabled(true); //设置保存并新增按钮不可用
    parentViewModel.get("btnSave").setDisabled(true); //设置保存按钮不可用
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button4sj") &&
  viewModel.get("button4sj").on("click", function (data) {
    // 添加--单击
    var parentViewModel = viewModel.getCache("parentViewModel"); //获取到父model
    parentViewModel.get("name").setValue(viewModel.get("name").getValue());
    parentViewModel.get("gender").setValue(viewModel.get("gender").getValue());
    parentViewModel.get("age").setValue(viewModel.get("age").getValue());
    parentViewModel.get("province_name").setValue(viewModel.get("province_name").getValue());
    parentViewModel.get("province").setValue(viewModel.get("province").getValue());
    viewModel.communication({ type: "modal", payload: { data: false } });
  });