viewModel.on("modeChange", function (data) {
  if (data == "browse") {
    viewModel.get("button55hi").setVisible(true);
    viewModel.get("button42xc").setVisible(true);
  } else {
    viewModel.get("button55hi").setVisible(false);
    viewModel.get("button42xc").setVisible(false);
  }
});
//保存前校验
viewModel.on("beforeSave", function (args) {
  debugger;
  let gridModel = viewModel.getGridModel();
  let rows = gridModel.getRows();
  for (var i = 0; i < rows.length - 1; i++) {
    for (var j = i + 1; j < rows.length; j++) {
      if (rows[i].wuliaobianma_code == rows[j].wuliaobianma_code) {
        cb.utils.confirm("物料编码  " + rows[i].wuliaobianma_code + "  已存在");
        return false;
      }
    }
  }
});
//删除前
viewModel.on("beforeDelete", function (args) {
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
viewModel.get("button42xc") &&
  viewModel.get("button42xc").on("click", function (data) {
    // 启用--单击
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
viewModel.get("button55hi") &&
  viewModel.get("button55hi").on("click", function (data) {
    // 按钮--单击
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