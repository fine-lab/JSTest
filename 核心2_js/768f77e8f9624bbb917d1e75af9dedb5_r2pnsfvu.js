function initExt(event) {
  var viewModel = this;
  viewModel.getGridModel().setState("showColumnSetting", false); // 栏目设置禁用
  // 页面初始化后禁用自动查询
  viewModel.getParams().autoLoad = false;
  viewModel.on("beforeSearch", function (event) {
    let { data, params } = event || {};
    let { commonVOs } = params.condition || {};
    let couldSearch = false;
    if (!commonVOs || commonVOs.length <= 0) {
      return couldSearch;
    }
    let conditions = [];
    for (let filter of commonVOs) {
      if (filter.itemName === "schemeName" || filter.itemName === "isDefault") {
        continue;
      }
      conditions.push(filter);
      couldSearch = couldSearch || !!filter.value1;
    }
    if (couldSearch) {
      let querySimpleVOs = viewModel.getCache("querySimpleVOs");
      let queryVersionMode = viewModel.getCache("queryVersionMode");
      // 上一版或者下一版查询继续使用querySimpleVOs进行查询，但是需要重置为默认最新版查询
      if (queryVersionMode !== 0) {
        viewModel.setCache("queryVersionMode", 0);
        viewModel.setCache("querySimpleVOs", []);
      }
      if (!querySimpleVOs || querySimpleVOs.length <= 0) {
        // 默认查询最新版
        querySimpleVOs.push({ field: "isLasted", op: "eq", value1: "Y" });
      }
      params.condition.simpleVOs = querySimpleVOs;
    }
    return couldSearch;
  });
}