viewModel.on("customInit", function (data) {
  // 发票税号详情--页面初始化
});
viewModel.on("modeChange", function (data) {
  if (data == "edit") {
    var fpztValue = viewModel.get("fpzt").getValue();
    if (fpztValue != "10") {
      viewModel.get("fapiaoshuihao").setState("bCanModify", false); //不可编辑
    }
  }
});
//新增时年度字段处理
viewModel.on("afterLoadData", function () {
  var yearMValue = viewModel.get("yearValue").getValue();
  if (yearMValue == null) {
    var nowDate = new Date();
    var yearValue = nowDate.getFullYear();
    viewModel.get("yearValue").setValue(yearValue);
  }
});