viewModel.get("button16ak") &&
  viewModel.get("button16ak").on("click", function (data) {
    //测试--单击
    debugger;
    var userRes = cb.rest.invokeFunction("AT17604A341D580008.wz03.tokenCreate", {}, function (err, res) {}, viewModel, { async: false });
    if (userRes.error) {
      cb.utils.alert("错误原因:" + userRes.error.message);
      return;
    } else {
      cb.utils.alert("拉取日志成功");
    }
    viewModel.execute("refresh");
  });