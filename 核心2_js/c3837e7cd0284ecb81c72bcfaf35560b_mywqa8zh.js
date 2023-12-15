viewModel.get("button22ma") &&
  viewModel.get("button22ma").on("click", function (data) {
    //发送消息--单击
    var rst = cb.rest.invokeFunction("AT19A7407808680008.frontDesignerFunction.sendMsg", {}, function (err, res) {}, viewModel, { async: false });
  });