viewModel.on("customInit", function (data) {
  //通用申请单--页面初始化
  viewModel.on("afterLoadData", function () {
    cb.rest.invokeFunction("RBSM.backDesignerFunction.queryDXYS", {}, function (err, res) {
      debugger;
    });
  });
});