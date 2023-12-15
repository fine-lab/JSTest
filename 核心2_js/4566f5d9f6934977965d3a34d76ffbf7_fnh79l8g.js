viewModel.get("bill_of_paymentList") &&
  viewModel.get("bill_of_paymentList").getEditRowModel() &&
  viewModel.get("bill_of_paymentList").getEditRowModel().get("paid_in_amount_y") &&
  viewModel
    .get("bill_of_paymentList")
    .getEditRowModel()
    .get("paid_in_amount_y")
    .on("blur", function (data) {
      // 实收金额(含税)--失去焦点的回调
      const paid_in_amount_y = viewModel.get("bill_of_paymentList").getEditRowModel().get("paid_in_amount_y");
      const accounts_receivable_amount_y = viewModel.get("bill_of_paymentList").getEditRowModel().get("accounts_receivable_amount_y");
      var v1 = paid_in_amount_y.__data.value;
      var v2 = accounts_receivable_amount_y.__data.value;
      if (v1 > v2) {
        cb.utils.alert("实收金额(含税)不能大于实收金额(含税)", "error");
      }
    });