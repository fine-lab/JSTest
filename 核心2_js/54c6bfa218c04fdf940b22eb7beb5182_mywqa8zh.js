// 服务中心人才库详情--页面初始化
viewModel.on("afterLoadData", function (all) {
  debugger;
  var hetonghao = viewModel.get("hetonghao").getValue();
  var zhuangtai = viewModel.get("zhuangtai").getValue();
  var result = cb.rest.invokeFunction("GT8313AT35.backOpenApiFunction.F5zx11", { hetonghao: hetonghao }, function (err, res) {}, viewModel, { async: false });
  var lt = cb.rest.invokeFunction("GT8313AT35.rule.ztlt11", { hetonghao: hetonghao }, function (err, res) {}, viewModel, { async: false });
});