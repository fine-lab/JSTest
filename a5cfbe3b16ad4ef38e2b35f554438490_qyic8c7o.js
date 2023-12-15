viewModel.on("customInit", function (data) {
  // 客户信息确认--页面初始化
  viewModel.get("btnBatchSave").setVisible(false);
  viewModel.getGridModel().setPageSize(200);
});
viewModel.on("beforeSearch", function (args) {
  var commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "custCategory",
    value1: 2
  });
});
viewModel.on("modeChange", function (e) {
  if (e == "edit") {
    viewModel.get("btnBatchSave").setVisible(true);
    viewModel.get("btnBatchPrintnow").setVisible(false);
  } else {
    viewModel.get("btnBatchSave").setVisible(false);
    viewModel.get("btnBatchPrintnow").setVisible(true);
  }
});
viewModel.getGridModel().on("afterCellValueChange", function (event) {
});
viewModel.get("btnBatchPrintnow") &&
  viewModel.get("btnBatchPrintnow").on("click", function (data) {
    // 提交确认--单击
    cb.rest.invokeFunction("AT16A11A2C17080008.API.setBGCustInfo", {}, function (err, res) {
      cb.utils.alert("数据已提交到总部。");
      viewModel.execute("refresh");
    });
  });
viewModel.on("customInit", function (data) {
  // 客户信息确认--页面初始化
});