viewModel.get("test_orderservicedetails_1624863265844101124") &&
  viewModel.get("test_orderservicedetails_1624863265844101124").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    //获取列表所有数据
    let gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        if (data.isdeal == "1") {
          if (action.cItemName == "button14xj") {
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
      viewModel.getGridModel().setCellValue(i, "item71wk", data[i].BaseMoney + data[i].UserMoney + data[i].OrgMoney);
    }
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
    //设置过滤条件
    filterReferModel.setFilter(myFilter);
  });
});