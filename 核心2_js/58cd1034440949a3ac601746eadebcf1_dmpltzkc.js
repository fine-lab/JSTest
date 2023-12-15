viewModel.get("shifukuaquyubanshichu") &&
  viewModel.get("shifukuaquyubanshichu").on("afterValueChange", function (data) {
    //是否跨区域办事处--值改变后
    if (data.value.value == "true") {
      alert(JSON.stringify(data.value.value == "true"));
      viewModel.get("shifuxuyaopeihe").setDisabled(false);
    }
  });
viewModel.get("xiaoshoufangfa_name") &&
  viewModel.get("xiaoshoufangfa_name").on("afterValueChange", function (data) {
    //销售方法--值改变后
  });