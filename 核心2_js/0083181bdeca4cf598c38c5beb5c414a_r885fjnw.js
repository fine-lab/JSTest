//一个空页面中放置两个page关联两个单据列表
viewModel.on("beforeSubPageRender", ({ vm, viewmeta }) => {
  debugger;
  if (viewmeta.cBillNo == "baoaccounta2") {
    viewModel.downViewModel = vm;
  } else {
    viewModel.upViewModel = vm;
    viewModel.upViewModel.on("beforeSearch", function () {
      let upFilterViewModel = viewModel.upViewModel.getCache("FilterViewModel");
      let downFilterViewModel = viewModel.DownViewModel.getCache("FilterViewModel");
      downFilterViewModel.get("search").fireEvent("click");
    });
  }
});