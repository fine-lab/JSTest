viewModel.get("shenfenzhenghao") &&
  viewModel.get("shenfenzhenghao").on("afterValueChange", function (data) {
    // 身份证号--值改变后
    const sfzh = viewModel.get("shenfenzhenghao").getValue();
    if (sfzh.length == 18) {
      cb.utils.alert("身份证号不合法");
    }
  });