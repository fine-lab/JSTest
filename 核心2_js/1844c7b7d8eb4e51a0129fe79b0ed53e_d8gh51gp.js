viewModel.get("button51pe") &&
  viewModel.get("button51pe").on("click", function (data) {
    // 启用--单击
    debugger;
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
        var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.BOMalterState", { zid: zid }, function (err, res) {}, viewModel, { async: false });
        if (inner.result.equipmentStatus == "1") {
          RowCodeQi += row[i].code + " ";
        }
      } else {
        RowCodeYQi += row[i].code + " ";
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
viewModel.get("button25tb") &&
  viewModel.get("button25tb").on("click", function (data) {
    // 停用--单击
    debugger;
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
        var inner = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.BOMwhetherBOM", { zid: zid }, function (err, res) {}, viewModel, { async: false });
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
      cb.utils.confirm("编码:" + RowCodeYQi + "已是禁用状态");
    }
    //刷新页面
    viewModel.execute("refresh");
  });