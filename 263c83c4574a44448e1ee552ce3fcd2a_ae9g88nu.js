viewModel.get("reviewdep_name") &&
  viewModel.get("reviewdep_name").on("blur", function (data) {
    // 复查部门--失去焦点的回调
  });
viewModel.get("reviewdep_name") &&
  viewModel.get("reviewdep_name").on("beforeBrowse", function (data) {
    // 复查部门--参照弹窗打开前
  });