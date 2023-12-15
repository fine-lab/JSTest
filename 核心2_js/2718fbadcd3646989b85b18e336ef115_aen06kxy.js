viewModel.on("afterInit", function (data) {
  // 树形报表页面--页面初始化
  debugger;
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  let filterModelInfo = filterViewModelInfo.get("sex");
  let realModelInfo = filterModelInfo.getFromModel();
});