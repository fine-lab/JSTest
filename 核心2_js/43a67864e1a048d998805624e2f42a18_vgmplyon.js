viewModel.on("customInit", function (data) {
  // 舆情类--页面初始化
  console.log(data);
  var gridModel = viewModel.getGridModel();
  gridModel.on("beforeMasterTableRowClick", function (index) {
    window.open(JSON.parse(this.getRows()[index].url).linkAddress);
    return false;
  });
});