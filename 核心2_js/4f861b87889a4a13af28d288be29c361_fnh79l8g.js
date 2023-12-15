viewModel.get("charge_date_star") &&
  viewModel.get("charge_date_star").on("beforeValueChange", function (data) {
    // 收费开始日期--值改变前
    var charge_date_end = viewModel.get("charge_date_end").getValue();
    if (charge_date_end == undefined || data.value == null) return true;
    var endDate = new Date(charge_date_end);
    var beginDate = new Date(data.value);
    if (beginDate > endDate) {
      cb.utils.alert("收费开始日期不能大于收费结束日期");
      return false;
    }
  });
viewModel.get("charge_date_end") &&
  viewModel.get("charge_date_end").on("beforeValueChange", function (data) {
    // 收费结束日期--值改变前
    var charge_begin_date = viewModel.get("charge_date_star").getValue();
    if (charge_begin_date == undefined || data.value == null) return true;
    var beginDate = new Date(charge_begin_date);
    var endDate = new Date(data.value);
    if (beginDate > endDate) {
      cb.utils.alert("收费结束日期不能小于收费开始日期");
      return false;
    }
  });
viewModel.get("date_lease") &&
  viewModel.get("date_lease").on("beforeValueChange", function (data) {
    // 收费开始日期--值改变前
    var lease_date_end = viewModel.get("date_lease_end").getValue();
    if (lease_date_end == undefined || data.value == null) return true;
    var endDate = new Date(lease_date_end);
    var beginDate = new Date(data.value);
    if (beginDate > endDate) {
      cb.utils.alert("租赁日期不能大于租赁结束日期");
      return false;
    }
  });
viewModel.get("date_lease_end") &&
  viewModel.get("date_lease_end").on("beforeValueChange", function (data) {
    // 收费结束日期--值改变前
    var lease_begin_date = viewModel.get("date_lease").getValue();
    if (lease_begin_date == undefined || data.value == null) return true;
    var beginDate = new Date(lease_begin_date);
    var endDate = new Date(data.value);
    if (beginDate > endDate) {
      cb.utils.alert("租赁结束日期不能小于租赁日期");
      return false;
    }
  });