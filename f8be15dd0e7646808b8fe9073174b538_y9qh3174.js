// 生成月报表按钮点击事件
viewModel.get("button16qc") &&
  viewModel.get("button16qc").on("click", function (data) {
    // 调用后端API生成月报表
    cb.rest.invokeFunction("AT16F3D57416B00008.backScript.costUnitPrice", {}, function (err, res) {
      // 刷新页面
      viewModel.execute("refresh");
    });
  });