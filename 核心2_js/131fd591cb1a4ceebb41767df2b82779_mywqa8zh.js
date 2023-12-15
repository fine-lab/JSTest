viewModel.get("xs_zly_1597482625982267396") &&
  viewModel.get("xs_zly_1597482625982267396").on("beforeSelect", function (data) {
    // 表格--选择前
  });
viewModel.get("xs_zly_1597482625982267396") &&
  viewModel.get("xs_zly_1597482625982267396").on("afterSelect", function (data) {
    // 表格--选择后
    debugger;
    const value = viewModel.get("verifystate").getValue();
    var data = viewModel.getData();
    if ((data.verifystate = "已审核")) {
      viewModel.get("btnDelete").setVisible(false);
    } else {
      viewModel.get("btnDelete").setVisible(true);
    }
  });