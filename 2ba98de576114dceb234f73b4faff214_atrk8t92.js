viewModel.get("nhBusinessType") &&
  viewModel.get("nhBusinessType").on("afterValueChange", function (data) {
    // 业务类型--值改变后
    debugger;
    if (data.value.value === "1") {
      viewModel.get("nhUsing").setVisible(false);
      viewModel.get("nhleavingReasons").setVisible(true);
      viewModel.get("nhContractPersonnel").setVisible(true);
      viewModel.get("nhDestination_name").setVisible(true);
      viewModel.get("nhDeparture").setVisible(true);
      viewModel.get("nhDepartureEnd").setVisible(true);
      viewModel.get("nhIdleDays").setVisible(true);
    } else {
      viewModel.get("nhleavingReasons").setVisible(false);
      viewModel.get("nhContractPersonnel").setVisible(false);
      viewModel.get("nhDestination_name").setVisible(false);
      viewModel.get("nhDeparture").setVisible(false);
      viewModel.get("nhDepartureEnd").setVisible(false);
      viewModel.get("nhIdleDays").setVisible(false);
      viewModel.get("nhUsing").setVisible(true);
    }
  });
viewModel.on("customInit", function (data) {
  debugger;
  viewModel.on("afterLoadMeta", function (data) {
    // 隐藏一个主表字段
    viewModel.get("btnBizFlowPush").setVisible(false);
    viewModel.get("btnModelPreview").setVisible(false);
  });
});