viewModel.on("customInit", function (data) {
  let voucherId = viewModel.get("extendVoucherId").getValue();
  if (voucherId == null || voucherId == "") {
    viewModel.get("button105le").setVisible(true); //生成暂估凭证
    viewModel.get("button171yc").setVisible(false); //删除暂估凭证
  } else {
    viewModel.get("button105le").setVisible(false); //生成暂估凭证
    viewModel.get("button171yc").setVisible(true); //删除暂估凭证
  }
});
viewModel.on("afterRule", function (data) {
  let srcBill = viewModel.getGridModel("srcBill").getValue();
  let currentState = viewModel.getParams().mode;
  debugger;
  if (currentState != "add" || srcBill == null || srcBill == "") {
    return;
  }
  let gridModel = viewModel.getGridModel("orderDetails");
  let rowDatas = gridModel.getRows();
  if (rowDatas.length > 1) {
    let tmp = [];
    rowDatas.forEach((rowData) => {
      if (rowData.productId != null && rowData.productId != "") {
        rowData._status = "Insert";
        rowData.iAuxUnitQuantity = rowData.priceQty;
        rowData.fMasterMeasureQuantity = rowData.priceQty;
        tmp.push(rowData);
      }
    });
    gridModel.setDataSource(tmp);
  }
});
viewModel.get("button105le") &&
  viewModel.get("button105le").on("click", function (data) {
    let voucherId = viewModel.get("headFreeItem!define59").getValue();
    let voucherCode = viewModel.get("headFreeItem!define60").getValue();
    if (voucherCode != null && voucherCode != undefined && voucherCode != "") {
    }
    let billCode = viewModel.get("code").getValue();
    let id = viewModel.get("id").getValue();
    cb.rest.invokeFunction("GT3734AT5.APIFunc.createVoucherApi", { redVoucher: 0, newFlag: 1, id: id, billCode: billCode }, function (err, res) {
      console.log("err=" + err);
      console.log("res=" + res);
      debugger;
      if (err != null) {
        cb.utils.alert("温馨提示！生成凭证失败，请刷新后重试!" + err.message, "error");
        return;
      }
      var rst = res.rst;
      if (rst) {
        var resVoucherCode = res.data.voucherCode;
        cb.utils.alert("温馨提示！单据[" + billCode + "]已成功生成凭证[" + resVoucherCode + "]", "info");
        viewModel.execute("refresh");
      } else {
        cb.utils.alert("温馨提示！凭证生成失败，请刷新后重试![" + res.msg + "]", "error");
      }
    });
  });
viewModel.get("button171yc") &&
  viewModel.get("button171yc").on("click", function (data) {
    let voucherId = viewModel.get("headFreeItem!define59").getValue();
    let voucherCode = viewModel.get("headFreeItem!define60").getValue();
    let billCode = viewModel.get("code").getValue();
    let id = viewModel.get("id").getValue();
    if (voucherCode == null || voucherCode == undefined || voucherCode == "") {
      cb.utils.alert("温馨提示!没查到凭证号或凭证已删除,请确认后重试!", "info");
      return;
    }
    cb.utils.confirm(
      "凭证删除后无法恢复，您确定要继续？[" + voucherCode + "][" + voucherId + "]",
      () => {
        cb.rest.invokeFunction("GT3734AT5.APIFunc.createVoucherApi", { redVoucher: 0, newFlag: 0, id: id, billCode: billCode, voucherCode: voucherCode, voucherId: voucherId }, function (err, res) {
          console.log("err=" + err);
          console.log("res=" + res);
          debugger;
          if (err != null) {
            cb.utils.alert("温馨提示！凭证[" + voucherCode + "]删除失败，请刷新后重试!" + err.message, "error");
            return;
          }
          var rst = res.rst;
          if (rst) {
            cb.utils.alert("温馨提示！凭证[" + voucherCode + "]已删除", "info");
            viewModel.execute("refresh");
          } else {
            cb.utils.alert("温馨提示！凭证[" + voucherCode + "]删除失败，请刷新后重试![" + res.msg + "]", "error");
          }
        });
      },
      () => {
        return;
      }
    );
  });