viewModel.on("customInit", function (data) {
  // 检索之前进行条件过滤
  viewModel.on("beforeSearch", function (args) {
    debugger;
    var body = viewModel.getParams().body;
    var id = body.id;
    var inspectType = body.inspectType;
    var gridModel = viewModel.getGridModel();
    args.isExtend = true;
    //通用检查查询条件
    var commonVOs = args.params.condition.commonVOs;
    commonVOs.push({
      itemName: "id",
      op: "eq",
      value1: id
    });
    if (inspectType == "02") {
      gridModel.on("afterSetDataSource", function (data) {
        gridModel.setColumnState("wuliaohuohao", "visible", false);
        gridModel.setColumnState("wuliao", "visible", false);
        gridModel.setColumnState("wuliaodanwei", "visible", false);
      });
    } else if (inspectType == 01) {
      gridModel.on("afterSetDataSource", function (data) {
        gridModel.setColumnState("hetongbianhao", "visible", false);
        gridModel.setColumnState("jine", "visible", false);
      });
    }
  });
});
viewModel.get("button3ug") &&
  viewModel.get("button3ug").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });