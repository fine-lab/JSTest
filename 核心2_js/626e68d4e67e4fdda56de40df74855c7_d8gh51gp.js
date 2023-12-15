viewModel.on("customInit", function (data) {
  // 检索之前进行条件过滤
  viewModel.on("beforeSearch", function (args) {
    debugger;
    var body = viewModel.getParams().body;
    var id = body.id;
    var inspectType = body.inspectType;
    //通用检查查询条件
    args.isExtend = true;
    //通用检查查询条件
    var commonVOs = args.params.condition.commonVOs;
    commonVOs.push({
      itemName: "BillOfMaterial_id.id",
      op: "eq",
      value1: id
    });
  });
});
viewModel.get("button27ue") &&
  viewModel.get("button27ue").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });