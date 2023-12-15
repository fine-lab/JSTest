viewModel.on("customInit", function (data) {
  // 上游主子--页面初始化
});
viewModel.on("beforeBatchpush", function () {
  alert("进来了");
});
let gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", function () {
  //获取列表所有数据
  const rows = gridModel.getRows(false);
  //从缓存区获取按钮
  const actions = gridModel.getCache("actions");
  if (!actions) return;
  const actionsStates = [];
  rows.forEach((data) => {
    const actionState = {};
    actions.forEach((action) => {
      actionState[action.cItemName] = { visible: true };
      //设置按钮是否可见
      if (data.new2 == "555") {
        if (action.cItemName == "btnEdit") {
          actionState[action.cItemName] = { visible: false };
        }
      }
    });
    actionsStates.push(actionState);
  });
  debugger;
  gridModel.setActionsState(actionsStates);
});
viewModel.get("button24jc") &&
  viewModel.get("button24jc").on("click", function (data) {
    // 按钮--单击
  });