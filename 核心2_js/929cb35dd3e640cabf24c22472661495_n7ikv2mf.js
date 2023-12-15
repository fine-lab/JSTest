viewModel.on("customInit", function (data) {
  //项目档案列表--页面初始化
});
viewModel.get("button18re") &&
  viewModel.get("button18re").on("click", function (data) {
    //按钮--单击
    cb.rest.invokeFunction("GT30659AT3.backDefaultGroup.UpdateCertDate", { id: "youridHere", startDate1: "2023-11-03" }, function (err, res) {});
  });