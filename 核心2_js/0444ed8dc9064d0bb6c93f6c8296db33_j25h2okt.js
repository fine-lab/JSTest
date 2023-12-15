viewModel.get("button14ge") &&
  viewModel.get("button14ge").on("click", function (data) {
    // 测试01--单击
    debugger;
    let chengbenyuResult = cb.rest.invokeFunction("HRCM.api.test001", { dczzId: 111 }, function (err, res) {}, viewModel, { async: false });
    console.log("helloworld" + chengbenyuResult);
  });