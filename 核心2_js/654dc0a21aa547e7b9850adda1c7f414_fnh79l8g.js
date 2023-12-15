viewModel.get("payment_adjustment_listList") &&
  viewModel.get("payment_adjustment_listList").getEditRowModel() &&
  viewModel.get("payment_adjustment_listList").getEditRowModel().get("paid_in_after_adjustment_y") &&
  viewModel
    .get("payment_adjustment_listList")
    .getEditRowModel()
    .get("paid_in_after_adjustment_y")
    .on("blur", function (data) {
      // 调整后实收(含税)--失去焦点的回调
      const after = viewModel.get("payment_adjustment_listList").getEditRowModel().get("paid_in_after_adjustment_y");
      const before = viewModel.get("payment_adjustment_listList").getEditRowModel().get("paid_in_before_adjustment_y");
      var after1 = after.__data.value;
      var before1 = before.__data.value;
      if (after1 > before1) {
        cb.utils.alert("调整后实收含税不能大于调整前实收含税！", "error");
      }
    });