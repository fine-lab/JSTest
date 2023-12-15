viewModel.get("button11ue") &&
  viewModel.get("button11ue").on("click", function (data) {
    // 同步删除明细--单击
    let filterViewModel = viewModel.getCache("FilterViewModel").getData();
    let org_id = filterViewModel.org_id.value1;
    if (org_id == "" || org_id == undefined || org_id == null) {
      cb.utils.alert("请选择组织！", "info");
      return;
    }
    let billtype_name = filterViewModel.billtype_name.value1;
    if (billtype_name == "" || billtype_name == undefined || billtype_name == null) {
      cb.utils.alert("请填写单据类型！", "info");
      return;
    }
    let ddate = filterViewModel.ddate.value1 + "~" + filterViewModel.ddate.value2;
    if (
      filterViewModel.ddate.value1 == "" ||
      filterViewModel.ddate.value1 == undefined ||
      filterViewModel.ddate.value1 == null ||
      filterViewModel.ddate.value2 == "" ||
      filterViewModel.ddate.value2 == undefined ||
      filterViewModel.ddate.value2 == null
    ) {
      cb.utils.alert("请选择单据日期！", "info");
      return;
    }
    let tenantId = viewModel.getAppContext().tenant.tenantId;
    var proxy = viewModel.setProxy({
      settle: {
        url: "/scmbc/barcodeflow/check",
        method: "get"
      }
    });
    //传参
    var param = {
      org_id,
      billtype_name,
      ddate,
      tenantId
    };
    proxy.settle(param, function (err, result) {
      debugger;
      if (err.code == "999") {
        cb.utils.alert(err.message, "error");
        return;
      }
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      viewModel.execute("refresh");
    });
  });
viewModel.on("customInit", function (data) {
  viewModel.getParams().autoLoad = false;
});