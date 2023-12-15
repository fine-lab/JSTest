viewModel.on("customInit", function (data) {
  // 供应商银行账户new--页面初始化
  var viewModel = this;
  let mode = viewModel.getParams().mode;
  // 卡片新增状态使用
  if (mode.toLocaleLowerCase() == "add") {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
  }
  viewModel.get("org_id_name").on("afterValueChange", () => {
    viewModel.get("inputdate").setValue(formatDate(new Date()));
  });
});