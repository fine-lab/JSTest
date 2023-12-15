viewModel.get("sysparent_name") && viewModel.get("sysparent_name").on("beforeBrowse", function (data) {});
viewModel.get("position") &&
  viewModel.get("position").on("afterValueChange", function (data) {
    // 地理位置--值改变后
  });