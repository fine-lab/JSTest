viewModel.get("pk_temp") &&
  viewModel.get("pk_temp").on("blur", function (data) {
    //模版--失去焦点的回调
    alert("提示");
  });