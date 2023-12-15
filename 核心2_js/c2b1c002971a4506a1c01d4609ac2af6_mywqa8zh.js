viewModel.on("customInit", function (event) {
  // 流转完结表单详情--页面初始化
  viewModel.on("afterLoadData", function () {
    //状态
    debugger;
    var liuzhuanbianhao = viewModel.get("liuzhuanbianhao").getValue();
    var zhuangtai = viewModel.get("zhuangtai").getValue();
    var verifystate = viewModel.get("verifystate").getValue();
    var a = cb.rest.invokeFunction(
      "GT8313AT35.rule.wanjieAPi",
      { zhuangtai: zhuangtai, liuzhuanbianhao: liuzhuanbianhao, verifystate: verifystate },
      function (err, res) {},
      viewModel,
      { async: false }
    );
  });
});
viewModel.get("button19sa") &&
  viewModel.get("button19sa").on("click", function (data) {
    // 按钮--单击
    debugger;
    var data1 = viewModel.getAllData();
    var id = data1.id;
    var a1 = cb.rest.invokeFunction("GT8313AT35.backDesignerFunction.cs520", { id: id }, function (err, res) {}, viewModel, { async: false });
  });