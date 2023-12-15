viewModel.on("afterLoadData", function (data) {
  //点击的按钮编码
  let staffInfo = cb.rest.invokeFunction("AT161BFEF009C80005.back.getStaff", {}, function (err, res) {}, viewModel, { async: false });
  debugger;
  viewModel.get("baoxiaoren").setValue(staffInfo.result.user.staffId);
  viewModel.get("baoxiaoren_name").setValue(staffInfo.result.user.name);
});