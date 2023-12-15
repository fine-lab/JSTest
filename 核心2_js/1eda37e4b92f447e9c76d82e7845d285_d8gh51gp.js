//删除前
viewModel.on("beforeBatchdelete", function (args) {
  let gridModel = viewModel.getGridModel();
  let rows = gridModel.getSelectedRows();
  for (var i = 0; i < rows.length; i++) {
    let BillOfMaterial_id = rows[i].id;
    var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.PanDuan", { BillOfMaterial: BillOfMaterial_id }, function (err, res) {}, viewModel, { async: false });
    if (inner.result.rev[0] != undefined) {
      cb.utils.confirm("数据被引用,无法删除");
      return false;
    }
  }
});
viewModel.get("button24uh") &&
  viewModel.get("button24uh").on("click", function (data) {
    // 启用--单击
    let gridModel = viewModel.getGridModel();
    let row = gridModel.getSelectedRows();
    //判断是否选中数据
    if (row.length == 0) {
      cb.utils.confirm("请选中行");
      return;
    }
    let RowCodeQi = "";
    let RowCodeYQi = "";
    for (var i = 0; i < row.length; i++) {
      if (row[i].equipmentStatus == 0) {
        let zid = row[i].id;
        var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.alterState", { zid: zid }, function (err, res) {}, viewModel, { async: false });
        if (inner.error) {
          cb.utils.confirm("编码:" + row[i].code + "启用失败：" + inner.error.message);
          return false;
        }
        if (inner.result.equipmentStatus == "1") {
          RowCodeQi += row[i].code + " , ";
        }
      } else {
        RowCodeYQi += row[i].code + " , ";
        break;
      }
    }
    if (RowCodeQi.length > 0) {
      cb.utils.confirm("编码:" + RowCodeQi + "启用成功");
    }
    if (RowCodeYQi.length > 0) {
      cb.utils.confirm("编码:" + RowCodeYQi + "已是启用状态");
    }
    //刷新页面
    viewModel.execute("refresh");
  });
viewModel.get("button30tj") &&
  viewModel.get("button30tj").on("click", function (data) {
    // 停用--单击
    let gridModel = viewModel.getGridModel();
    let row = gridModel.getSelectedRows();
    //判断是否选中数据
    if (row.length == 0) {
      cb.utils.confirm("请选中行");
      return;
    }
    let RowCodeQi = "";
    let RowCodeYQi = "";
    for (var i = 0; i < row.length; i++) {
      if (row[i].equipmentStatus == 1) {
        let zid = row[i].id;
        var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.disableState", { zid: zid }, function (err, res) {}, viewModel, { async: false });
        if (inner.error) {
          cb.utils.confirm("编码:" + row[i].code + "停用失败：" + inner.error.message);
          return false;
        }
        if (inner.result.equipmentStatus == "0") {
          RowCodeQi += row[i].code + " , ";
        }
      } else {
        RowCodeYQi += row[i].code + " , ";
        break;
      }
    }
    if (RowCodeQi.length > 0) {
      cb.utils.confirm("编码:" + RowCodeQi + "停用成功");
    }
    if (RowCodeYQi.length > 0) {
      cb.utils.confirm("编码:" + RowCodeYQi + "已是停用状态");
    }
    //刷新页面
    viewModel.execute("refresh");
  });