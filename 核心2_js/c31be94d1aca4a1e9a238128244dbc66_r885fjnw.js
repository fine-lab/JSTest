viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 销售组织--值改变后
    var envUrl = viewModel.getAppContext().serviceUrl;
    var params = viewModel.getParams();
    cb.rest.invokeFunction("AT1832AE3609F80004.openApi.sales", { params: params, envUrl: envUrl }, function (err, res) {
      if (res != undefined && res.data != undefined) {
        let salesDelegateDefaultData = res.data.salesDelegateDefaultData;
        //清缓存
        viewModel.clearCache("salesDelegateDe");
        //设置缓存
        viewModel.setCache("salesDelegateDe", salesDelegateDefaultData);
        //获取表格模型
        let gridModel = viewModel.getGridModel();
        gridModel.setColumnValue("stockOrgId", salesDelegateDefaultData.inventory_org); //库存组织ID
        gridModel.setColumnValue("stockOrgId_name", salesDelegateDefaultData.inventory_org_name); //库存组织名字
      }
    });
  });
viewModel.on("afterAddRow", function (data) {
  // 销售订单(简版)_nishch12详情--页面初始化
  //清缓存
  let salesDelegateDe = viewModel.getCache("salesDelegateDe");
  let gridModel = viewModel.getGridModel();
  gridModel.setCellValue(data.index, "stockOrgId", salesDelegateDefaultData.inventory_org);
  gridModel.setCellValue(data.index, "stockOrgId_name", salesDelegateDefaultData.inventory_org_name);
});
viewModel.on("customInit", function (data) {
  // 销售订单(简版)_nishch12详情--页面初始化
  //获取当前的model
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
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
        if (action.cItemName == "btnDelete") {
          if (data.exchRate == 1) {
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
});