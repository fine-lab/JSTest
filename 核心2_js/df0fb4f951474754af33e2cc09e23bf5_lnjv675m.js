viewModel.on("customInit", function (data) {
  // 零售单打印列表--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  let id = viewModel.getParams().id;
  console.log("id", id);
  args.isExtend = true;
  args.params.condition.simpleVOs = [];
  args.params.condition.simpleVOs.push({
    field: "id",
    op: "eq",
    value1: id
  });
});
viewModel.getGridModel().on("afterSetDataSource", function () {
  viewModel.getGridModel().select(0);
  viewModel.get("btnBatchPrintnow").execute("click");
});