viewModel.get("costsharing_1705118870465413122") &&
  viewModel.get("costsharing_1705118870465413122").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
  });
viewModel.get("costsharing_1705118870465413122") &&
  viewModel.get("costsharing_1705118870465413122").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    debugger;
    var resl = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.Listlogic", { data: data }, function (err, res) {}, viewModel, { async: false });
    if (resl.error) {
      cb.utils.alert("错误原因:" + resl.error.message);
      return;
    }
    viewModel.execute("refresh");
  });