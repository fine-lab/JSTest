viewModel.get("button30nc") &&
  viewModel.get("button30nc").on("click", function (data) {
    // 确定--单击
    var gridModel = viewModel.getGridModel();
    //当前选中行的数据
    const rowsData = gridModel.getSelectedRows();
    if (rowsData.length != 1) {
      cb.utils.alert("请选择一条数据!", "error");
      return false;
    }
    //获取到父model
    var parentViewModel = viewModel.getCache("parentViewModel");
    // 获取当前行的下标
    let currentLine = viewModel.getParams().currentLine;
    // 每个页面传对应的子实体集合属性
    let page = viewModel.getParams().page;
    // 获取对应页面的表格模型
    var model = parentViewModel.get(page);
    // 给剩余可用量和订单编码回写值
    if (page == "details") {
      model.setCellValue(currentLine, ["bodyDefine!define2"], rowsData[0].purchaseOrders_bodyFreeItem_define6);
      model.setCellValue(currentLine, ["bodyDefine!define1"], rowsData[0].code);
    } else {
      model.setCellValue(currentLine, ["defines!define2"], rowsData[0].purchaseOrders_bodyFreeItem_define6);
      model.setCellValue(currentLine, ["defines!define1"], rowsData[0].code);
    }
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
//查询前事件
viewModel.on("beforeSearch", function (args) {
  let productId = viewModel.getParams().product;
  args.isExtend = true;
  //根据物料和剩余可用量大于0进行过滤
  var conditions = args.params.condition;
  conditions.simpleVOs = [
    {
      logicOp: "and",
      conditions: [
        {
          field: "purchaseOrders.productn",
          op: "eq",
          value1: productId
        },
        {
          field: "purchaseOrders.bodyFreeItem.define6",
          op: "gt",
          value1: 0
        }
      ]
    }
  ];
});