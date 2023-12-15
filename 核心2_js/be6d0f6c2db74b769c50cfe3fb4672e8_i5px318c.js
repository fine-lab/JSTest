// 更新计划拜访覆盖率
viewModel.on("afterLoadData", function (data) {
  var count = data.chargeTerminalCount > 0 ? (data.terminalCount || 0) / data.chargeTerminalCount : 0;
  viewModel.get("item356ae").setValue(count * 100);
});