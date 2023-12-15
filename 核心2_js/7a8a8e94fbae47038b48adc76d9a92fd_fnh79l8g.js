viewModel.get("start_accounting_year") &&
  viewModel.get("start_accounting_year").on("beforeValueChange", function (data) {
    // 开始会计年月--值改变前
    var fiscal_year_end = viewModel.get("fiscal_year_ended").getValue();
    if (fiscal_year_end == undefined || data.value == null) return true;
    var endDate = new Date(fiscal_year_end);
    var beginDate = new Date(data.value);
    if (beginDate > endDate) {
      cb.utils.alert("开始会计年月不能大于截止会计年月");
      return false;
    }
  });
viewModel.get("fiscal_year_ended") &&
  viewModel.get("fiscal_year_ended").on("beforeValueChange", function (data) {
    // 截止会计年月--值改变前
    var start_accounting_year = viewModel.get("start_accounting_year").getValue();
    if (start_accounting_year == undefined || data.value == null) return true;
    var beginDate = new Date(start_accounting_year);
    var endDate = new Date(data.value);
    if (beginDate > endDate) {
      cb.utils.alert("截止会计年月不能小于开始会计年月");
      return false;
    }
  });