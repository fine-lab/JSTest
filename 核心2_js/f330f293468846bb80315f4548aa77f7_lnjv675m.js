viewModel.get("gxsorgadmin_1787764477663903752") &&
  viewModel.get("gxsorgadmin_1787764477663903752").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
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
        if (data.isEnable == "1") {
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
  });
viewModel.on("afterMount", function (args) {
  //过滤数据，按照创建人过滤
  viewModel.on("beforeSearch", function (data) {
    let result = cb.rest.invokeFunction("GT34544AT7.user.getAppContext", {}, function (err, res) {}, viewModel, { async: false });
    let userId = result.result.res.currentUser.id;
    data.isExtend = true;
    data.params.condition.simpleVOs = [
      {
        field: "creator",
        op: "eq",
        value1: userId
      }
    ];
  });
});