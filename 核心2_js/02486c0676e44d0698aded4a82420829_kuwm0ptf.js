viewModel.get("domain") &&
  viewModel.get("domain").on("afterValueChange", function (data) {
    // 领域--值改变后
    console.log(data);
    var listData = [
      { value: "1", text: "测试1" },
      { value: "2", text: "测试2" }
    ];
    viewModel.get("module").setDataSource(listData);
    console.log("测试");
  });