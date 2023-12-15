viewModel.on("customInit", function (data) {});
viewModel.get("yg_class_1624395105818902532") &&
  viewModel.get("yg_class_1624395105818902532").on("afterSelect", function (data) {
    // 树参照--选择后
    debugger;
    const data11 = viewModel.getAllData();
    cb.utils.alert(data11);
  });