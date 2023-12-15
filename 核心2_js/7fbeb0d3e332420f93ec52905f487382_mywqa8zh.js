viewModel.on("modeChange", function (data) {
  // 任务详情--页面初始化
  debugger;
  if (data == "edit" || data == "browse") {
    cb.utils.alert(data);
    var hh = viewModel.get("hetonghao").getValue();
    if (hh == "1529416070179848199") {
      viewModel.get("btnBizFlowBatchPush").setDisabled(true);
    }
  }
});