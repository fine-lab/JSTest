viewModel.get("button24kc") &&
  viewModel.get("button24kc").on("click", function (data) {
    // 红冲--单击
    //获取红冲单据下标所有数据
    const data1 = viewModel.getData();
    //获取红冲单据下标
    var Index = data.index;
    //获取需要红冲的数据
    var model = data1.taskorder_1492246409580642308[Index];
    // 调用API脚本
    var res = cb.rest.invokeFunction("GT102917AT3.API.taskOrderHC", { model: model }, function (err, res) {}, viewModel, { async: false });
    viewModel.execute("refresh");
    if (res.error.message != undefined) {
      if (res.error.message == "1") {
        cb.utils.alert("此单据已经红冲");
      }
    }
  });
viewModel.on("customInit", function (data) {
  // 任务下达单--页面初始化
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
        if (action.cItemName == "button24kc") {
          if (data.yesOrNo == 2) {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});