viewModel.get("button66cf") &&
  viewModel.get("button66cf").on("click", function (data) {
    // 测试按钮--单击
  });
viewModel.get("button66ob") &&
  viewModel.get("button66ob").on("click", function (data) {
    // 测试--单击
    cb.rest.invokeFunction("ycContractManagement.ycContractTest.contractTest1", {}, function (err, res) {
      alert(res.toString());
    });
  });
viewModel.on("customInit", function (data) {
  // 采购合同--页面初始化
});