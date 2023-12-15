viewModel.get("button22gb") &&
  viewModel.get("button22gb").on("click", function (data) {
    // 测试按钮--单击
    debugger;
    let testRes = cb.rest.invokeFunction("GT5646AT1.apifunction.test", {}, function (err, res) {}, viewModel, { async: false });
    if (testRes.error != null) {
      cb.utils.confirm("错误信息为：" + testRes.error.message);
      return false;
    } else {
      cb.utils.alert("更新完成！");
      return false;
    }
  });