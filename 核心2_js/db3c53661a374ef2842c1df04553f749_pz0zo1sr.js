viewModel.get("button43oc") &&
  viewModel.get("button43oc").on("click", function (data) {
    // 推送SAP--单击
    let gridModel = viewModel.getGridModel();
    let datas = gridModel.getSelectedRows();
    if (datas.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    for (var i = 0; i < datas.length; i++) {
      let res1 = cb.rest.invokeFunction("AT15D7426009680001.apiCode.getProSaveNew", { prop: datas[i] }, function (err, res) {}, viewModel, { async: false });
      if (res1.error != undefined) {
        cb.utils.alert("选中第" + Number(i + 1) + "行更新失败:" + res1.error.message, "error");
      } else {
        if (res1.result.productResponseJSON.code == 200) {
          cb.utils.alert("选中第" + Number(i + 1) + "行更新成功", "success");
        } else {
          cb.utils.alert("选中第" + Number(i + 1) + "行更新失败:" + res1.result.productResponseJSON.message, "error");
        }
      }
    }
  });