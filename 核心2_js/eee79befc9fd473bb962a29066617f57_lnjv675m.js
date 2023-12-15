viewModel.get("button7qb") &&
  viewModel.get("button7qb").on("click", function (data) {
    // 刷新--单击
    viewModel.execute("refresh");
  });
viewModel.on("customInit", function (data) {
  // 员工查询表--页面初始化
  viewModel.on("beforeSearch", function (args) {
    let sysManagerOrg = viewModel.getParams().parentParams.sysManagerOrg;
    let mobile = viewModel.getParams().parentParams.mobile;
    args.isExtend = true;
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push({
      field: "org_id",
      op: "eq",
      value1: sysManagerOrg
    });
    args.params.condition.simpleVOs.push({
      field: "mobile",
      op: "eq",
      value1: mobile
    });
  });
  viewModel.on("afterAudit", (data) => {
    setTimeout(function () {
      viewModel.execute("refresh");
    }, 1000);
    cb.cache.set("refresh", "1");
  });
});
viewModel.getGridModel().on("afterSetDataSource", function (data) {
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
        if (action.cItemName == "button2ha") {
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