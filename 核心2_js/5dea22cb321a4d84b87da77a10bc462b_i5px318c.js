//审批流程中显示编辑按钮
viewModel.on("afterLoadData", (args) => {
  if (args.isWfControlled && args.verifystate == 1) {
    setTimeout(function () {
      viewModel.get("btnEdit")?.setVisible(true);
    }, 0);
  }
});