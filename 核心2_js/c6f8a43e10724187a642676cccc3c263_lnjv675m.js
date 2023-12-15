viewModel.on("customInit", function (data) {
  // 零售打印列表--页面初始化
});
viewModel.on("afterMount", function () {
  var code = viewModel.getParams().code;
  const filtervm = viewModel.getCache("FilterViewModel");
  filtervm.on("afterInit", function () {
    // 进行查询区相关扩展
    filtervm.get("code").getFromModel().setValue(code);
  });
});
viewModel.getGridModel().on("afterSetDataSource", function () {
  viewModel.getGridModel().select(0);
  viewModel.get("btnBatchPrintnow").execute("click");
  setTimeout(function () {
    viewModel.communication({ type: "modal", payload: { data: false } });
  }, 3000);
});