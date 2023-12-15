viewModel.get("telephone") &&
  viewModel.get("telephone").on("afterValueChange", function (data) {
    // 手机号--值改变后
    debugger;
    var telephone = data.value;
    if (telephone.trim() != "") {
      cb.rest.invokeFunction("", {}, function (err, res) {});
    }
  });