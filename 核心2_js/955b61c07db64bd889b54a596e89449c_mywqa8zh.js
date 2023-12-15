viewModel.on("customInit", function (data) {
  // 服务中心内部流转单详情--页面初始化
  viewModel.on("afterLoadData", function () {
    let value = viewModel.get("code").getValue();
    viewModel.get("liushuihao").setValue(value);
    //状态
    debugger;
    var verifystate = viewModel.get("verifystate").getValue();
    var zhuangtai = viewModel.get("zhuangtai").getValue();
    var zhengshuhetonghao = viewModel.get("zhengshuhetonghao_hetonghao").getValue();
    var a = cb.rest.invokeFunction(
      "GT8313AT35.rule.shiyongzhongapi",
      { zhuangtai: zhuangtai, zhengshuhetonghao: zhengshuhetonghao, verifystate: verifystate },
      function (err, res) {},
      viewModel,
      { async: false }
    );
    var ab = cb.rest.invokeFunction(
      "GT8313AT35.backOpenApiFunction.PanDuanZhuangtai",
      { zhengshuhetonghao: zhengshuhetonghao },
      function (err, res) {},
      viewModel,
      { async: false }
    );
  });
});