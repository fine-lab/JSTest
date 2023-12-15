viewModel.on("customInit", function (data) {
  // 函数test202212301833详情--页面初始化
});
viewModel.on("customInit", function (data) {
  viewModel.get("shuzhi").setValue(3);
  viewModel.get("shuzhi")._set_data("cDefaultValue", 3);
});
viewModel.on("beforeSave", function (args) {
  var shuliang = viewModel.get("shuzhi").getValue();
  var sl = 3;
  const isAfterDate = (NumberA, NumberB) => NumberA > NumberB;
  if (!isAfterDate(shuliang, sl)) {
    cb.utils.confirm("最少数量需要大于3，请修改");
    return false;
  }
});
viewModel.get("wenben") &&
  viewModel.get("wenben").on("afterValueChange", function (data) {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
    var res = viewModel.get("riqi").setValue(formatDate(new Date()));
    viewModel.get("riqi")._set_data("cDefaultValue", formatDate(new Date()));
  });