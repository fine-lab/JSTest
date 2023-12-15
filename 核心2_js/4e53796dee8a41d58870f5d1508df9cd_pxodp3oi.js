viewModel.get("button32dd") &&
  viewModel.get("button32dd").on("click", function (data) {
    // 反审核--单击
    let id = viewModel.get("id").getValue();
    if (!id) {
      cb.utils.alert("温馨提示,凭证未审核不能弃审!", "info");
      return;
    }
    let rest = cb.rest.invokeFunction("AT1703B12408A00002.selfApi.chkVouchUnAudit", { voucherIds: id }, function (err, res) {}, viewModel, { async: false });
    if (!rest.result.rst) {
      cb.utils.alert("温馨提示,凭证:" + rest.result.displayName + "[" + rest.result.voucherCode + "]已经镜像或同步U8，不能反审核!", "info");
    } else {
      viewModel.get("btnUnAudit").fireEvent("click");
    }
  });