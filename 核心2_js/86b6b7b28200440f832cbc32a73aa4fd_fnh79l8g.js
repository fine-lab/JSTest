viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    // 片区名称--值改变后
    viewModel.set("vsmartparkcode", viewModel.get("code"));
    viewModel.set("vsmartparkname", viewModel.get("name"));
  });