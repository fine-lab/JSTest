viewModel.get("button18ec") &&
  viewModel.get("button18ec").on("click", function (data) {
    // 同步配置--单击
    var rows = viewModel.getGridModel().getSelectedRows();
    var tenantId = cb.context.getTenantId();
    if (rows.length > 0) {
      cb.rest.invokeFunction("AT171B4ED81C400009.API.pushFW", { rows: rows, tenantId: tenantId }, function (err, res) {});
    } else {
      cb.utils.alert("请选择数据", "error");
    }
  });