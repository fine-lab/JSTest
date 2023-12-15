cb.defineInner([], function () {
  var common_VM_Extend = (function () {
    //卡片按钮控制
    var setVoucherButtonState = function (viewModel) {
      let mode = viewModel.getParams().mode;
      //单据状态
      let verifystate = viewModel.get("verifystate").getValue();
      //业务流控制
      let pk_procdefins = viewModel.get("pk_procdefins");
      if (verifystate == 1) {
        viewModel.get("btnEdit").setVisible(false);
        viewModel.get("btnDelete").setVisible(false);
        viewModel.get("btnUnsubmit").setVisible(true);
        viewModel.get("btnWorkflow").setVisible(true);
        viewModel.get("btnSubmit").setVisible(false);
        viewModel.get("button9fg").setVisible(false);
        viewModel.get("button9tf").setVisible(false);
      } else if (verifystate == 2) {
        viewModel.get("btnEdit").setVisible(false);
        viewModel.get("btnDelete").setVisible(false);
        if (!pk_procdefins || !pk_procdefins.getValue()) {
          viewModel.get("button9fg").setVisible(true);
          viewModel.get("button9tf").setVisible(false);
          viewModel.get("btnUnsubmit").setVisible(false);
          viewModel.get("btnWorkflow").setVisible(false);
          viewModel.get("btnSubmit").setVisible(false);
        } else {
          viewModel.get("button9fg").setVisible(false);
          viewModel.get("button9tf").setVisible(false);
          viewModel.get("btnUnsubmit").setVisible(false);
          viewModel.get("btnSubmit").setVisible(false);
          viewModel.get("btnWorkflow").setVisible(true);
        }
      } else if (verifystate == 0) {
        viewModel.get("btnEdit").setVisible(true);
        viewModel.get("btnDelete").setVisible(true);
        if (!pk_procdefins || !pk_procdefins.getValue()) {
          viewModel.get("button9fg").setVisible(false);
          viewModel.get("button9tf").setVisible(true);
          viewModel.get("btnUnsubmit").setVisible(false);
          viewModel.get("btnWorkflow").setVisible(false);
          viewModel.get("btnSubmit").setVisible(false);
        } else {
          viewModel.get("button9fg").setVisible(false);
          viewModel.get("button9tf").setVisible(false);
          viewModel.get("btnUnsubmit").setVisible(false);
          viewModel.get("btnSubmit").setVisible(true);
          viewModel.get("btnWorkflow").setVisible(true);
        }
      }
      if (mode == "add" || mode == "edit") {
        viewModel.get("btnEdit").setVisible(false);
        viewModel.get("btnDelete").setVisible(false);
        viewModel.get("btnUnsubmit").setVisible(false);
        viewModel.get("btnWorkflow").setVisible(false);
        viewModel.get("btnSubmit").setVisible(false);
        viewModel.get("button9fg").setVisible(false);
        viewModel.get("button9tf").setVisible(false);
      }
    };
    return {
      setVoucherButtonState: setVoucherButtonState
    };
  })();
  return common_VM_Extend;
});