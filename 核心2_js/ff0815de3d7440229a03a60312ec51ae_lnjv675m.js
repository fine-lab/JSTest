viewModel.on("customInit", function (data) {
  //产权注销登记--页面初始化
  viewModel.on("beforeBatchsubmit", function (args) {
    let rowData = JSON.parse(args.data.data);
    let billId = rowData[0].id;
    //调用api根据主表ID汇总子表持股比例
    let result = cb.rest.invokeFunction("GT34544AT7.LocalOrgRegisterParam.queryCGBLByID", { id: billId }, function (err, res) {}, viewModel, { async: false });
    let sumShareholdingRatio = result.result.res[0].ShareholdingRatio;
    if (sumShareholdingRatio !== 100) {
      cb.utils.alert("持股比例不等于100，不允许提交！", "error");
      return false;
    }
  });
});
viewModel.get("orgregister_1731472239672950790") &&
  viewModel.get("orgregister_1731472239672950790").on("afterSetDataSource", function (data) {
    //企业产权登记--设置数据源后
    let gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        actionState[action.cItemName] = { visible: true };
        if (data.verifystate == 1 || data.verifystate == 2 || data.verifystate == 3) {
          if (action.cItemName == "button19gg") {
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
  });