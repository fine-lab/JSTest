viewModel.on("afterMount", function () {
  let filterVM = viewModel.getCache("FilterViewModel");
  filterVM.setState("bHideFilterScheme", true);
  let parentVM = viewModel.getCache("parentViewModel");
  debugger;
  viewModel.get("btnEdit").setDisabled(true);
  let code = null;
  viewModel.on("beforeSearch", function (args) {
    if (code == null) {
      return false;
    }
    // 获取父页面查询参数，写入子页面查询参数
    let params = { value1: code, itemName: "itemCode" };
    args.params.condition.commonVOs.push(params);
  });
  // 点击物料编码筛选库存页面
  let gridModel = parentVM.get("demandforecast_1674943718609649667");
  gridModel.on("masterTableRowClick", function (index) {
    code = gridModel.getRow(index).itemCode;
    let id = gridModel.getRow(index).id;
    viewModel.setCache("selectId", id);
    const schemeId = filterVM.getCache("schemeId");
    filterVM.get("search").fireEvent("click", { solutionid: schemeId });
    if (code == null) {
      viewModel.get("btnEdit").setDisabled(true);
    } else {
      viewModel.get("btnEdit").setDisabled(false);
    }
  });
  // 设置表格复选框为隐藏
  viewModel.get("demandstock_1674965425377509381").setShowCheckbox(false);
});