//活动计划审批过程显示编辑按钮
viewModel.on("afterLoadData", (args) => {
  let mode = viewModel.getParams().mode;
  if ((args.isWfControlled && args.verifystate == 1) || (mode === "browse" && args.verifystate == 4)) {
    setTimeout(function () {
      viewModel.get("btnEdit")?.setVisible(true);
    }, 0);
  }
});