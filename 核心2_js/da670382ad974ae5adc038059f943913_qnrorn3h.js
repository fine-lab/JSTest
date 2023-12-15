viewModel.on("afterLoadData", function (data) {
  // 返回值详情--页面初始化
  let code = viewModel.getParams().code; //获取参数，调用后端函数获取处理过后的字符串
  console.log("========================");
  console.log(viewModel.getParams());
  cb.rest.invokeFunction("AT16F1F07C08C80009.backcode.getReturn", { r: code }, function (err, res) {
    if (res) viewModel.get("fanhuizhi").setValue(res.r); //设置到字段上去
  });
});