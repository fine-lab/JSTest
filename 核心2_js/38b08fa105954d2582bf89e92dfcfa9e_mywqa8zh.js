//提交后
viewModel.on("afterBatchsubmit", function (args) {
  debugger;
  //获取表单数据
  let data = args.res.infos;
  var id = data[0].id;
  var res = cb.rest.invokeFunction("GT101949AT1.API.sppp", { id: id }, function (err, res) {}, viewModel, { async: false });
});