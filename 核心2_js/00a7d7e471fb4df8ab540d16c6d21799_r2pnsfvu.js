function initExt(event) {
  var viewModel = this;
  viewModel.getParams().autoLoad = false;
  viewModel.on("afterMount", function (event) {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
  });
}