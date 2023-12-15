viewModel.get("button22qa") &&
  viewModel.get("button22qa").on("click", function (data) {
    // 生成出入库--单击
    debugger;
    var girdModel = viewModel.getGridModel();
    // 获取grid中已选中行的数据
    const extant = girdModel.getSelectedRows();
    if (extant.length == 0) {
      cb.utils.alert("请至少选择一行数据！");
      return;
    }
    var resl = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.batchInAndOut", { data: extant }, function (err, res) {}, viewModel, { async: false });
    if (resl.error) {
      cb.utils.alert("错误原因:" + resl.error.message, "error");
      return;
    } else {
      cb.utils.alert("生成出入库成功", "success");
    }
    viewModel.execute("refresh");
  });