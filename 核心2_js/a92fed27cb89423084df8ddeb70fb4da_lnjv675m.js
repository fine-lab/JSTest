viewModel.get("button3lb") &&
  viewModel.get("button3lb").on("click", function (data) {
    // 刷新--单击
    viewModel.execute("refresh");
  });
viewModel.on("customInit", function (data) {
  viewModel.on("beforeSearch", function (args) {
    let sysManagerOrg = viewModel.getParams().parentParams.sysManagerOrg;
    let mobile = viewModel.getParams().parentParams.mobile;
    args.isExtend = true;
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push({
      field: "UserOrg",
      op: "eq",
      value1: sysManagerOrg
    });
    args.params.condition.simpleVOs.push({
      field: "mobile",
      op: "eq",
      value1: mobile
    });
    args.params.condition.simpleVOs.push({
      field: "RoleCode",
      op: "eq",
      value1: "ZZGL_YWZZ001"
    });
  });
  viewModel.on("afterAudit", (data) => {
    setTimeout(function () {
      viewModel.execute("refresh");
    }, 1000);
  });
});
viewModel.get("test_org_userrole_1676813738556522497") &&
  viewModel.get("test_org_userrole_1676813738556522497").on("afterSetDataSource", function (data) {
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
          if (action.cItemName == "button1ai") {
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