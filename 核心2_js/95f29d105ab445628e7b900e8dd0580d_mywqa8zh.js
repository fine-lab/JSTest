viewModel.get("button43lh") &&
  viewModel.get("button43lh").on("click", function (data) {
    // 同步SAP--单击
    let gridModel = viewModel.getGridModel();
    let datas = gridModel.getSelectedRows();
    if (datas.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    for (var i = 0; i < datas.length; i++) {
      let res1 = cb.rest.invokeFunction("GT62AT45.backDesignerFunction.getProSaveNew", { prop: datas[i] }, function (err, res) {}, viewModel, { async: false });
      if (res1.error != undefined) {
        cb.utils.alert(JSON.stringify(res1.error), "error");
      } else {
        if (res1.result.productResponseJSON.code == 200) {
          cb.utils.alert("选中第" + Number(i + 1) + "行更新成功", "success");
        } else {
          cb.utils.alert("选中第" + Number(i + 1) + "行更新失败:" + res1.result.productResponseJSON.message, "error");
        }
      }
    }
  });