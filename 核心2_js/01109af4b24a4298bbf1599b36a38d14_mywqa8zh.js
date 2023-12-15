viewModel.on("customInit", function (data) {
  // 收款单--页面初始化
  var filterModel = viewModel.getCache("FilterViewModel");
  filterModel.on("afterInit", function () {
    filterModel.get("contractNo").getFromModel().setValue(11);
  });
});