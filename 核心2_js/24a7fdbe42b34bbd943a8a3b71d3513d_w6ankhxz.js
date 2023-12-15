viewModel.get("payDate") &&
  viewModel.get("payDate").on("beforeValueChange", function (data) {
    // 到期付款日--值改变前
    if (data.value == null) return true;
    var today = new Date();
    var endDate = new Date(data.value);
    if (endDate <= today) {
      cb.utils.alert("到期付款日必须大于当前日期");
      return false;
    }
  });