viewModel.on("customInit", function (data) {
  // 任务下达单测试详情--页面初始化
  viewModel.on("afterLoadData", function () {
    //用于卡片页面，页面初始化赋值等操作
    debugger;
    const gridModel = viewModel.getGridModel("TaskorderdetailsList");
    gridModel.setColumnState("door", "bCanModify", false);
  });
});