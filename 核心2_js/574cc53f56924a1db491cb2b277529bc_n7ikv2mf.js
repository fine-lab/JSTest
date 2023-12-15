viewModel.on("customInit", function (data) {
  //审批流程测试--页面初始化
});
viewModel.get("button19vg") &&
  viewModel.get("button19vg").on("click", function (data) {
    //按钮--单击
    cb.rest.invokeFunction("GT33423AT4.backDefaultGroup.approveTest", {}, function (err, res) {
      debugger;
    });
  });