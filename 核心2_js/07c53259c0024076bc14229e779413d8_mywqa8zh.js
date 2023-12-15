viewModel.on("customInit", function (data) {
  // 销售订单--页面初始化
  var girdModel = viewModel.getGridModel();
  // 获取
  viewModel.get("saleOrgid_name").on("beforeBrowse", function () {
    // 获取当前编辑行的品牌字段值
    const value = viewModel.get("agetid").getValue();
    // 实现品牌的过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "merchantApplyRanges.orgId",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
});
viewModel.get("xiaoshou_zhang_1510050036871331843") &&
  viewModel.get("xiaoshou_zhang_1510050036871331843").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    //获取当前的model
    let gridModel = viewModel.getGridModel();
    gridModel.on("afterSetDataSource", () => {
      debugger;
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
            if (data.verifystate == 2) {
              actionState[action.cItemName] = { visible: false };
            }
          }
        });
        actionsStates.push(actionState);
      });
      gridModel.setActionsState(actionsStates);
    });
  });