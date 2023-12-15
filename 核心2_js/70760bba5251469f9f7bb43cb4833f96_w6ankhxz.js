viewModel.get("rc_vfinance_detailsList") &&
  viewModel.get("rc_vfinance_detailsList").on("afterCellValueChange", function (data) {
    // 表格-凭证融资明细--单元格值改变后
    // 计算融资金额
    const list = viewModel.getGridModel("rc_vfinance_detailsList").getRows();
    let count = 0;
    list.forEach((item) => {
      count += item["item858kj"];
    });
    viewModel.get("amount").setValue(count);
  });
viewModel.get("dueTime") &&
  viewModel.get("dueTime").on("beforeValueChange", function (data) {
    // 融资到期日--值改变前
    if (data.value == null) return true;
    var today = new Date();
    var endDate = new Date(data.value);
    if (endDate <= today) {
      cb.utils.alert("融资到期日必须大于当前日期");
      return false;
    }
  });