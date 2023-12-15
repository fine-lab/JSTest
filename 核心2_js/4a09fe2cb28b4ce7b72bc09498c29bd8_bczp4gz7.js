viewModel.get("button11ue") &&
  viewModel.get("button11ue").on("click", function (data) {
    // 同步删除明细--单击
    let filterViewModel = viewModel.getCache("FilterViewModel");
    let org_id = filterViewModel.get("org_id").getFromModel().getValue();
    let pk_stordoc = filterViewModel.get("pk_stordoc").getFromModel().getValue();
    debugger;
    if (org_id == "" || org_id == undefined) {
      cb.utils.alert("请选择组织！", "info");
      return;
    }
    if (pk_stordoc == "" || pk_stordoc == undefined) {
      cb.utils.alert("请选择仓库！", "info");
      return;
    }
    var proxy = viewModel.setProxy({
      settle: {
        url: "/scmbc/barcodeflow/check",
        method: "get"
      }
    });
    //传参
    var param = {
      org_id,
      pk_stordoc
    };
    proxy.settle(param, function (err, result) {
      debugger;
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      viewModel.execute("refresh");
    });
  });
viewModel.on("customInit", function (data) {
  // 条码流水新--页面初始化
  viewModel.getParams().autoLoad = false;
});