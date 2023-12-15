viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  viewModel.on("afterMount", function () {
    //通过filterRows字段控制查询区显示行数
    let filters = viewModel.getCache("FilterViewModel");
    filters.on("afterInit", function (data) {
      filters
        .get("register")
        .getFromModel()
        .on("beforeBrowse", function () {
          let orgId = filters.get("org_id").getFromModel().getValue();
          if (orgId != undefined && orgId != null && orgId != "") {
            var condition = {
              isExtend: true,
              simpleVOs: []
            };
            let orConditions = [];
            orConditions.push({
              field: "mainJobList.org_id",
              op: "eq",
              value1: orgId
            });
            orConditions.push({
              field: "mainJobList.dept_id",
              op: "eq",
              value1: orgId
            });
            condition.simpleVOs.push({
              logicOp: "or",
              conditions: orConditions
            });
            this.setFilter(condition);
          } else {
            let condition = {
              isExtend: true,
              simpleVOs: []
            };
            this.setFilter(condition);
          }
        });
    });
  });
  gridModel.on("afterSetDataSource", function (data) {
    const rows = gridModel.getRows();
    console.log(rows);
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      console.log(data);
      const actionState = {};
      actions.forEach((action) => {
        if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
          if (data.verifystate == 2 || data.verifystate == "2") {
            actionState[action.cItemName] = { visible: false };
          } else {
            actionState[action.cItemName] = { visible: true };
          }
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});