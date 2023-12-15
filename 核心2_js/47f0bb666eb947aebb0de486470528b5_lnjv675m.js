viewModel.on("customInit", function (data) {
  //员工初始化--页面初始化
  //列表过滤
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push({
      field: "staffChangeType",
      op: "eq",
      value1: "initialization"
    });
  });
});
viewModel.get("staffbase_1782351281264263176") &&
  viewModel.get("staffbase_1782351281264263176").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
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
          if (action.cItemName == "button28oa") {
            //隐藏审核按钮
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName == "btnEdit") {
            //隐藏编辑按钮
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName == "btnDelete") {
            //隐藏删除按钮
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });