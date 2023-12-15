//监听页面状态变化系统预制钩子函数modeChange
//例子：新增页面，按钮的显示/隐藏
viewModel.on("modeChange", function (data) {
  if (data == "browse") {
    viewModel.get("button28nk").setVisible(true);
    viewModel.get("button44aj").setVisible(true);
    setTimeout(function () {
      viewModel.get("btnBizFlowPush").setVisible(false); //下推按钮
      viewModel.get("btnModelPreview").setVisible(false); //打印模板
    }, 500);
  } else {
    viewModel.get("button28nk").setVisible(false);
    viewModel.get("button44aj").setVisible(false);
  }
});
viewModel.on("customInit", function (data) {
  // 检测订单详情--页面初始化
  var gridModelGoods = viewModel.getGridModel("processBOMSonList");
  gridModelGoods.on("afterCellValueChange", function (params) {
    debugger;
    var rowIndex = params.rowIndex;
    var cellName = "billOfMaterial_bommingchen";
    var value = params.value.bommingchen;
    gridModelGoods.setCellValue(rowIndex, cellName, value);
  });
});
//保存前校验
viewModel.on("beforeSave", function (args) {
});
viewModel.get("button44aj") &&
  viewModel.get("button44aj").on("click", function (data) {
    // 启用--单击
    debugger;
    let zid = viewModel.get("id").getValue();
    let equipmentStatus = viewModel.get("equipmentStatus").getValue();
    if (equipmentStatus == 0) {
      var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.BOMalterState", { zid: zid }, function (err, res) {}, viewModel, { async: false });
      if (inner.result.equipmentStatus == "1") {
        cb.utils.confirm("启用成功");
        //刷新页面
        viewModel.execute("refresh");
      }
    } else {
      cb.utils.confirm("已是启用状态");
    }
  });
viewModel.get("button28nk") &&
  viewModel.get("button28nk").on("click", function (data) {
    // 按钮--单击
    debugger;
    let zid = viewModel.get("id").getValue();
    let equipmentStatus = viewModel.get("equipmentStatus").getValue();
    if (equipmentStatus == 1) {
      var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.BOMwhetherBOM", { zid: zid }, function (err, res) {}, viewModel, { async: false });
      if (inner.result.equipmentStatus == "0") {
        cb.utils.confirm("禁用成功");
        //刷新页面
        viewModel.execute("refresh");
      }
    } else {
      cb.utils.confirm("已是禁用状态");
    }
  });