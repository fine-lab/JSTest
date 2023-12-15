viewModel.get("enterprisebankaccount_account").on("afterMount", function (data) {
  // 收款银行账户--参照加载完成后
  const value = viewModel.get("enterprisebankaccount_account").getValue();
  let str = value.substr(value.length - 4, 4);
  viewModel.get("enterprisebankaccount_account").setValue(str);
});
viewModel.on("customInit", function (data) {
  // 收款--页面初始化
});
viewModel.on("afterLoadData", function () {
  const value = viewModel.get("enterprisebankaccount_account").getValue();
  let str = value.substr(value.length - 4, 4);
  viewModel.get("enterprisebankaccount_account").setValue(str);
});
viewModel.get("enterprisebankaccount_account").on("afterValueChange", function (data) {
  // 收款银行账户--值改变后
  const value = viewModel.get("enterprisebankaccount_account").getValue();
  let str = value.substr(value.length - 4, 4);
  viewModel.get("enterprisebankaccount_account").setValue(str);
});