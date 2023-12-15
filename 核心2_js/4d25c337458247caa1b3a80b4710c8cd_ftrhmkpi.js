viewModel.get("shifuguanlianhetong") &&
  viewModel.get("shifuguanlianhetong").on("afterValueChange", function (data) {
    // 是否关联合同--值改变后
    viewModel.get("guanlainxiangmubianhao").setVisible(true);
    viewModel.get("ziduan9").setVisible(true);
    viewModel.get("shifuguanlianhetong").setVisible(true);
  });