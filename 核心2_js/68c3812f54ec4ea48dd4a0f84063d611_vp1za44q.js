viewModel.on("modeChange", function (data) {
  if (data == "browse") {
    viewModel.get("button39ba").setVisible(true);
    viewModel.get("button57gd").setVisible(true);
  } else {
    viewModel.get("button39ba").setVisible(false);
    viewModel.get("button57gd").setVisible(false);
  }
});
//删除前
viewModel.on("beforeDelete", function (args) {
  debugger;
  let gridModel = viewModel.getGridModel();
  let rows = gridModel.getRows();
  for (var i = 0; i < rows.length; i++) {
    let BillOfMaterial_id = rows[i].BillOfMaterial_id;
    var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.PanDuan", { BillOfMaterial: BillOfMaterial_id }, function (err, res) {}, viewModel, { async: false });
    if (inner.result.rev[0] != undefined) {
      cb.utils.confirm("数据被引用,无法删除");
      return false;
    }
  }
});
viewModel.get("button39ba") &&
  viewModel.get("button39ba").on("click", function (data) {
    // 启用--单击
    debugger;
    let zid = viewModel.get("id").getValue();
    let equipmentStatus = viewModel.get("equipmentStatus").getValue();
    if (equipmentStatus == 0) {
      var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.alterState", { zid: zid }, function (err, res) {}, viewModel, { async: false });
      if (inner.result.equipmentStatus == "1") {
        cb.utils.confirm("启用成功");
        //刷新页面
        viewModel.execute("refresh");
      }
    } else {
      cb.utils.confirm("已是启用状态");
    }
  });
viewModel.get("button57gd") &&
  viewModel.get("button57gd").on("click", function (data) {
    // 按钮--单击
    debugger;
    let zid = viewModel.get("id").getValue();
    let equipmentStatus = viewModel.get("equipmentStatus").getValue();
    if (equipmentStatus == 1) {
      var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.disableState", { zid: zid }, function (err, res) {}, viewModel, { async: false });
      if (inner.result.equipmentStatus == "0") {
        cb.utils.confirm("禁用成功");
        //刷新页面
        viewModel.execute("refresh");
      }
    } else {
      cb.utils.confirm("已是禁用状态");
    }
  });
viewModel.get("hanshuijine") &&
  viewModel.get("hanshuijine").on("afterValueChange", function (data) {
    // 含税金额--值改变后
    debugger;
    var ntaxRate = viewModel.get("shuilv_ntaxRate").getValue();
    ntaxRate = ntaxRate == undefined ? 0 : ntaxRate / 100;
    //含税金额
    const hanshuijine = viewModel.get("hanshuijine").getValue();
    if (ntaxRate != 0) {
      let wushuijine = (hanshuijine / (1 + ntaxRate)).toFixed(4);
      viewModel.get("wushuijine").setValue(wushuijine);
    } else {
      viewModel.get("wushuijine").setValue(hanshuijine);
    }
  });
viewModel.get("shuilv_code") &&
  viewModel.get("shuilv_code").on("afterValueChange", function (data) {
    // 税率--值改变后
    debugger;
    var ntaxRate = viewModel.get("shuilv_ntaxRate").getValue();
    ntaxRate = ntaxRate == undefined ? 0 : ntaxRate / 100;
    //含税金额
    const hanshuijine = viewModel.get("hanshuijine").getValue();
    if (ntaxRate != 0) {
      let wushuijine = (hanshuijine / (1 + ntaxRate)).toFixed(4);
      viewModel.get("wushuijine").setValue(wushuijine);
    } else {
      viewModel.get("wushuijine").setValue(hanshuijine);
    }
  });