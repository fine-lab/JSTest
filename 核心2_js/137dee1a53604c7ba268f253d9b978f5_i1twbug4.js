viewModel.get("website") &&
  viewModel.get("website").on("afterValueChange", function (data) {
    // 网址--值改变后
    var billno = viewModel.get("code").getValue();
    cb.utils.crmCommonFn.pcRepeat.cardCheckRepeat(viewModel, "browse", billno);
  });
viewModel.get("creditCode") &&
  viewModel.get("creditCode").on("afterValueChange", function (data) {
    // 统一社会信用代码--值改变后
    var billno = viewModel.get("code").getValue();
    cb.utils.crmCommonFn.pcRepeat.cardCheckRepeat(viewModel, "browse", billno);
  });
viewModel.get("email") &&
  viewModel.get("email").on("afterValueChange", function (data) {
    // 邮箱--值改变后
    var billno = viewModel.get("code").getValue();
    cb.utils.crmCommonFn.pcRepeat.cardCheckRepeat(viewModel, "browse", billno);
  });