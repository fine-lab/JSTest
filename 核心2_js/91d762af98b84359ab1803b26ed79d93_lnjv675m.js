viewModel.on("customInit", function (data) {
  // 服务订购单--页面初始化
});
viewModel.on("afterMount", function (data) {
  //获取查询区模型
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  filterViewModelInfo.on("afterInit", function (data) {
    //获取参照模型
    let filterReferModel = filterViewModelInfo.get("test_GxyService").getFromModel();
    var myFilter = { isExtend: true, simpleVOs: [] };
    myFilter.simpleVOs.push({
      field: "charge",
      op: "eq",
      value1: "1"
    });
    myFilter.simpleVOs.push({
      field: "enable",
      op: "eq",
      value1: "1"
    });
    //设置过滤条件
    filterReferModel.setFilter(myFilter);
  });
});
viewModel.get("test_addserviceapply_1622329037573062662") &&
  viewModel.get("test_addserviceapply_1622329037573062662").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    let gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        actionState[action.cItemName] = { visible: true };
        if (data.verifystate == 2) {
          if (action.cItemName == "button22if") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName == "btnEdit") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName == "btnDelete") {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
    for (let i = 0; i < data.length; i++) {
      viewModel.getGridModel().setCellValue(i, "item76hj", data[i].BaseMoney + data[i].UserMoney + data[i].OrgMoney);
    }
  });