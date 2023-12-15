viewModel.get("xs_zwh_1593794614867787784") &&
  viewModel.get("xs_zwh_1593794614867787784").on("beforeSelect", function (data) {
    // 表格--选择前
    const value = viewModel.get("verifystate").getValue();
    if (value == "已审核") {
      viewModel.get("btnDelete").setVisible(false);
    }
  });