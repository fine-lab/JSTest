viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 按钮--单击
    debugger;
    throw new Error("测试异常");
    return;
  });
viewModel.on("customInit", function (data) {
  // 客户费用单-金额--页面初始化
  debugger;
  viewModel.get("button24me").setVisible(true);
  viewModel.get("button50me").setVisible(true);
  viewModel.get("button24me").setDisabled(true);
  viewModel.get("button50me").setDisabled(true);
});
viewModel.get("button50me") &&
  viewModel.get("button50me").on("click", function (data) {
    // 费用调整表体--单击
  });
// 客户费用调整单详情--页面初始化
viewModel.on("customInit", function (data) {
  viewModel.on("modeChange", (mode) => {
    debugger;
    if (mode.toLocaleLowerCase() == "browse") {
      viewModel.get("button24me").setVisible(false); //true
    } else {
      viewModel.get("button24me").setVisible(true); //true
    }
  });
});
viewModel.get("button24me") &&
  viewModel.get("button24me").on("click", function (data) {
    // 选择客户费用--单击
    debugger;
    let datanew = {
      billtype: "VoucherList", // 列表：voucher
      billno: "1296c485", // 列表页：编码
      params: {
        mode: "browse", // (编辑态、新增态、浏览态)
        readOnly: true,
        hello: "打开客户费用单模态框，测试！" // 父页面向模态框页面的传值
      }
    };
    cb.loader.runCommandLine("bill", datanew, viewModel);
  });