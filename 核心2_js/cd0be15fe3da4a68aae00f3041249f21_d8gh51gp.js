viewModel.get("button35cc") &&
  viewModel.get("button35cc").on("click", function (data) {
    // 启用--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const resuu = gridModel.getSelectedRows();
    if (resuu.length == 0) {
      cb.utils.alert("  -- 请选择至少一条! -- ");
      return;
    } else {
      //调用api
      for (var i = 0; i < resuu.length; i++) {
        var alll = resuu[i];
        var result = cb.rest.invokeFunction("AT15F164F008080007.utils.start", { alll: alll }, function (err, res) {}, viewModel, { async: false });
        viewModel.execute("refresh");
        var resu = result.error ? result.error.code : undefined;
        if (resu != undefined) {
          cb.utils.alert(" --设备编号:" + alll.shebeibianma + "设备名:" + alll.shebeimingchen + "为启用状态,请勿重复点击 -- ");
        }
      }
      viewModel.execute("refresh");
    }
  });
viewModel.get("button43yg") &&
  viewModel.get("button43yg").on("click", function (data) {
    // 停用--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const resuu = gridModel.getSelectedRows();
    if (resuu.length == 0) {
      cb.utils.alert("  -- 请选择至少一条! -- ");
      return;
    } else {
      //调用api
      for (var i = 0; i < resuu.length; i++) {
        var alll = resuu[i];
        var resu = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.stop", { alll: alll }, function (err, res) {}, viewModel, { async: false });
        viewModel.execute("refresh");
        var resu = result.error ? result.error.code : undefined;
        if (resu != undefined) {
          cb.utils.alert(" --设备编号:" + alll.shebeibianma + "设备名:" + alll.shebeimingchen + "为停用状态,请勿重复点击 -- ");
        }
      }
      viewModel.execute("refresh");
    }
  });
//删除前
viewModel.on("beforeBatchdelete", function (args) {
  debugger;
  let gridModel = viewModel.getGridModel();
  let rows = gridModel.getSelectedRows();
  for (var i = 0; i < rows.length; i++) {
    let id = rows[i].id;
    var resopone = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.selZibiao", { id: id }, function (err, res) {}, viewModel, { async: false });
    var aa = resopone.result.aa != undefined ? resopone.result.aa : undefined;
    if (aa != "0") {
      cb.utils.confirm("数据被引用,无法删除");
    }
  }
});