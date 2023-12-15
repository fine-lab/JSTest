viewModel.on("customInit", function (data) {
  //发货装箱单详情--页面初始化
  viewModel.on("afterLoadData", function (args) {
    var viewModel = this;
    //根据单据状态显示/隐藏按钮，提交、撤回、审批。
    var verifystate = viewModel.get("verifystate").getValue();
    console.log("单据状态：" + verifystate);
    if (verifystate === 1) {
      viewModel.get("btnSubmit").setVisible(false);
      viewModel.get("btnUnsubmit").setVisible(true);
      viewModel.get("btnWorkflow").setVisible(true);
    } else if (verifystate === 2) {
      viewModel.get("btnSubmit").setVisible(false);
      viewModel.get("btnUnsubmit").setVisible(false);
      viewModel.get("btnWorkflow").setVisible(true);
    } else if (verifystate === 4) {
      viewModel.get("btnSubmit").setVisible(true);
      viewModel.get("btnUnsubmit").setVisible(true);
      viewModel.get("btnWorkflow").setVisible(true);
    } else if (verifystate === 0) {
      viewModel.get("btnSubmit").setVisible(true);
      viewModel.get("btnUnsubmit").setVisible(false);
      viewModel.get("btnWorkflow").setVisible(false);
    }
  });
});