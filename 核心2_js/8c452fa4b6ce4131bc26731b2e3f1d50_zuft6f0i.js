viewModel.get("usepoint") &&
  viewModel.get("usepoint").on("beforeValueChange", function (data) {
    //使用--值改变后
    let { value, oldValue } = data;
    if (value == 0) {
      cb.utils.alert("使用积分必须大于0");
      return false;
    }
    let rem = value % 100;
    if (rem > 0) {
      cb.utils.alert("使用积分必须为100的倍数");
      return false;
    }
  });