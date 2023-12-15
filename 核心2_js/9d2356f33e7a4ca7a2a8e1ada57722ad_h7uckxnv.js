viewModel.get("button18kb") &&
  viewModel.get("button18kb").on("click", function (data) {
    // 生成授权地址--单击
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows.length == 0) {
      cb.utils.alert("请选择配置信息", "error");
      return;
    } else {
      cb.rest.invokeFunction("AT167004801D000002.backDesignerFunction.getGrantUrl", { rows }, function (err, res) {
        viewModel.execute("refresh");
      });
    }
  });