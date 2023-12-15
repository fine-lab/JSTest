viewModel.on("customInit", function (data) {
  // 审批回写测试--页面初始化
});
//提交后
viewModel.on("afterBatchsubmit", function (args) {
  var viewModel = this;
  debugger;
  //获取表单数据
  let data = args.res.infos;
  for (var i = 0; i < data.length; i++) {
    var id = data[i].id;
  }
  var res = cb.rest.invokeFunction("GT102917AT3.API.shenpihuixie", { id: id }, function (err, res) {}, viewModel, { async: false });
});