viewModel.get("button19yd") &&
  viewModel.get("button19yd").on("click", function (data) {
    // 选择客户费用单--单击
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
debugger;
// 客户费用调整单详情--页面初始化
viewModel.on("customInit", function (data) {
  viewModel.on("modeChange", (mode) => {
    debugger;
    if (mode.toLocaleLowerCase() == "browse") {
      viewModel.get("button19yd").setVisible(false); //true
      //弃审
      viewModel.get("button38ne").setVisible(true); //true
    } else {
      viewModel.get("button19yd").setVisible(true); //true
      //弃审
      viewModel.get("button38ne").setVisible(false); //true
    }
  });
});
viewModel.get("btnWorkflow") &&
  viewModel.get("btnWorkflow").on("click", function (data) {
    // 审批--单击
  });