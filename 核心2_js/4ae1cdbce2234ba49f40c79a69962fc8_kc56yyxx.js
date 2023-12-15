viewModel.get("button26fh") &&
  viewModel.get("button26fh").on("click", function (data) {
    // 收入凭证--单击
    debugger;
    let gridModel = viewModel.getGridModel();
    let filtervm = viewModel.getCache("FilterViewModel");
    let sendDate = filtervm.get("send_voucher_data").getFromModel().getValue();
    let rows = gridModel.getSelectedRows();
    let list = cb.rest.invokeFunction("GT65230AT76.backDefaultGroup.Voucher", { rows: rows, sendDate: sendDate }, function (err, res) {}, viewModel, { async: false });
    if (list.result.err != undefined) {
      alert(list.result.err);
    }
  });
viewModel.get("button30ij") &&
  viewModel.get("button30ij").on("click", function (data) {
    // 按钮--单击
    debugger;
    var pl = cb.rest.invokeFunction("GT65230AT76.backDefaultGroup.getSaleOrder", {}, function (err, res) {}, viewModel, { async: false });
  });
viewModel.get("button34ed") &&
  viewModel.get("button34ed").on("click", function (data) {
    // 生产税额凭证--单击
    debugger;
    let gridModel = viewModel.getGridModel();
    let filtervm = viewModel.getCache("FilterViewModel");
    let sendDate = filtervm.get("send_voucher_data").getFromModel().getValue();
    let rows = gridModel.getSelectedRows();
    let list = cb.rest.invokeFunction("GT65230AT76.backDefaultGroup.taxAmountVoucher", { rows: rows, sendDate: sendDate }, function (err, res) {}, viewModel, { async: false });
    if (list.result.err != undefined) {
      alert(list.result.err);
    }
  });