var gridModel = viewModel.getGridModel();
gridModel.setShowCheckbox(false);
viewModel.get("button11ue") &&
  viewModel.get("button11ue").on("click", function (data) {
    // 同步删除明细--单击
    let filterViewModel = viewModel.getCache("FilterViewModel");
    let filterData = filterViewModel.getData();
    let org_id = filterData.org_id.value1;
    if (org_id == "" || org_id == undefined || org_id == null) {
      cb.utils.alert("请选择组织！", "warning");
      return;
    }
    let billtype_name = filterData.billtype_name.value1;
    if (billtype_name == "" || billtype_name == undefined || billtype_name == null) {
      cb.utils.alert("请填写单据类型！(采购入库/产品入库/调拨入库/委外入库/其他入库/材料出库/销售出库/调拨出库/其他出库/转库/实盘单/复盘单/货位调整)", "warning");
      return;
    }
    let ddate1 = filterViewModel.get("ddate").getFromModel().getValue();
    let ddate2 = filterViewModel.get("ddate").getToModel().getValue();
    if (!ddate1 || !ddate2) {
      cb.utils.alert("请选择单据日期！", "warning");
      return;
    }
    let ddate = ddate1 + " 00:00:00~" + ddate2 + " 23:59:59";
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
      if (err.code == "999") {
        cb.utils.alert(err.message, "error");
        return;
      }
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      viewModel.execute("refresh");
      cb.utils.alert("同步删除明细完成！" + err.msg, "info");
    });
  });
viewModel.on("customInit", function (data) {
  // 条码流水新--页面初始化
  viewModel.getParams().autoLoad = false;
});