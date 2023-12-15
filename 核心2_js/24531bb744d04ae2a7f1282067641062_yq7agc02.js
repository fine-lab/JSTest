viewModel.get("button77ch") &&
  viewModel.get("button77ch").on("click", function (data) {
    // 测试--单击
    var tttt = cb.rest.invokeFunction("ST.backDesignerFunction.tttt1", {}, function (err, res) {}, viewModel, { async: false });
    if (tttt.error) {
      cb.utils.alert(tttt.error.message);
      return false;
    }
  });