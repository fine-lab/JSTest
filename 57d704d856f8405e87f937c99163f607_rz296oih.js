viewModel.on("customInit", function (data) {
  // 库存数量页签--页面初始化
});
viewModel.on("afterMount", function () {
  let filterVM = viewModel.getCache("FilterViewModel");
  filterVM.setState("bHideFilterScheme", true);
  let parentVM = viewModel.getCache("parentViewModel");
  let parentFilterVM = parentVM.getCache("FilterViewModel");
  viewModel.on("beforeSearch", function (args) {
    // 获取父页面查询参数，替换子页面查询参数
    let parentSearchParams = parentVM.getCache("parentSearchParams");
    args.params.condition.commonVOs = parentSearchParams;
  });
  parentVM.on("beforeSearch", function (args) {
    const schemeId = filterVM.getCache("schemeId");
    filterVM.get("search").fireEvent("click", { solutionid: schemeId });
  });
});