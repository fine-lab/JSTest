viewModel.get("button33jg") &&
  viewModel.get("button33jg").on("click", function (data) {
    // 存货--单击
    var rows = viewModel.getGridModel().getSelectedRows();
    var inner = cb.rest.invokeFunction("SCMSA.backDesignerFunction.test", { rows: rows }, function (err, res) {}, viewModel, { async: false });
    if (inner.result > 0) {
      return false;
    }
  });
viewModel.get("button45hj") &&
  viewModel.get("button45hj").on("click", function (data) {
    // 发票--单击
  });
viewModel.get("button58zc") &&
  viewModel.get("button58zc").on("click", function (data) {
    // 客户--单击
  });