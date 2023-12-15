viewModel.on("customInit", function (data) {
  // 主子_lxf--页面初始化
  var viewModel = this;
  viewModel.on("afterMount", function () {
    var filterModel = viewModel.getCache("FilterViewModel");
    filterModel.on("afterInit", function () {
      filterModel.get("new1").getFromModel().setValue(222);
    });
  });
});