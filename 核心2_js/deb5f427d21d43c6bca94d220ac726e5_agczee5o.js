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
viewModel.on("afterCopy", (data) => {
  debugger;
  let mode = viewModel.getParams().mode;
  if (mode == "add") {
    let defalultBillDate = () => {
      let currentDate = new Date();
      let yyyy_mm_dd = null;
      try {
        yyyy_mm_dd = new Date().format("yyyy-MM-dd");
      } catch (error) {
        console.log("设置默认单据日期:::系统format失败，使用自定义获取时间代码！");
        yyyy_mm_dd =
          currentDate.getFullYear() +
          "-" +
          (currentDate.getMonth().toString().length < 2 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1) +
          "-" +
          (currentDate.getDate().toString().length < 2 ? "0" + currentDate.getDate() : currentDate.getDate());
      }
      setViewModelValue("vouchdate", yyyy_mm_dd);
    };
    setTimeout(defalultBillDate, 800);
  }
});
//设置页面主表值
function setViewModelValue(fieldName, value) {
  viewModel.get(fieldName).setValue(value);
}