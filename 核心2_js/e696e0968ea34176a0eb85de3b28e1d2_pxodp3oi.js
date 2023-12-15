viewModel.on("glDelete", function (data) {
  let dataRows = viewModel.getGridModel().getSelectedRows();
  cb.rest.invokeFunction("GL.serviceFunc.insertDelLog", { data: dataRows }, function (err, res) {});
});
viewModel.get("button21oe") &&
  viewModel.get("button21oe").on("click", function (data) {
    // 反审核--单击
    let voucherIds = [];
    let dataRows = viewModel.getGridModel().getSelectedRows(); //bd_voucherlist
    for (var i in dataRows) {
      let rowObj = dataRows[i];
      let auditor = rowObj.auditor;
      if (auditor != undefined && auditor != null && auditor != "") {
        voucherIds.push(rowObj.id);
      } else {
        voucherIds.push(rowObj.id); //测试脚本
      }
    }
    if (voucherIds.length == 0) {
      cb.utils.alert("温馨提示,请选择已审核单据进行操作!", "info");
      return;
    }
    let rest = cb.rest.invokeFunction("AT1703B12408A00002.selfApi.chkVouchUnAudit", { voucherIds: voucherIds.join() }, function (err, res) {}, viewModel, { async: false });
    if (!rest.result.rst) {
      cb.utils.alert("温馨提示,凭证:" + rest.result.displayName + "[" + rest.result.voucherCode + "]已经镜像或同步U8，不能反审核!", "info");
    } else {
      viewModel.get("glUnAudit").fireEvent("click");
    }
  });