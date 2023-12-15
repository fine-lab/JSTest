viewModel.on("customInit", function (data) {});
viewModel.get("button21vg") &&
  viewModel.get("button21vg").on("click", function (data) {
    // 测试--单击
    var ss = cb.rest.invokeFunction("GT4946AT20.backDesignerFunction.testSendData", {}, function (err, res) {}, viewModel, { async: false });
    if (ss.error) {
      cb.utils.alert("发送失败!");
    } else {
      cb.utils.alert("发送成功!");
    }
  });