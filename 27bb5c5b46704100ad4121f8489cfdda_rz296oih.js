viewModel.on("afterMount", function () {
  let filterVM = viewModel.getCache("FilterViewModel");
  filterVM.setState("bHideFilterScheme", true);
  let parentVM = viewModel.getCache("parentViewModel");
  let code = null;
  debugger;
  viewModel.on("beforeSearch", function (args) {
    // 获取父页面查询参数，写入子页面查询参数
    let params = { value1: code, itemName: "sdMaterialCode" };
    args.params.condition.commonVOs.push(params);
  });
  // 点击物料编码筛选库存页面
  let gridModel = parentVM.get("predictionapiinfo_1670307885522354184");
  gridModel.on("masterTableRowClick", function (index) {
    debugger;
    code = gridModel.getRow(index).sdMaterialCode;
    const schemeId = filterVM.getCache("schemeId");
    filterVM.get("search").fireEvent("click", { solutionid: schemeId });
  });
});