viewModel.get("button24vd") &&
  viewModel.get("button24vd").on("click", function (data) {
    // 单据红冲--单击
    debugger;
    //获取红冲单据下标所有数据
    const allData = viewModel.getAllData();
    //获取红冲单据下标
    var Index = data.index;
    //获取需要红冲的数据
    var record = allData.advancemaintenance_1525524185565102085[Index];
    var code = record.id;
    // 调用API脚本
    var res = cb.rest.invokeFunction("GT102917AT3.API.maintenanceHC", { record: record, code: code }, function (err, res) {}, viewModel, { async: false });
    if (res.result.length != undefined) {
      alert("该单据已经红冲，不能再次红冲！");
    }
    viewModel.execute("refresh");
  });
viewModel.on("customInit", function (data) {
  debugger;
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
        if (action.cItemName == "button24vd") {
          if (data.billState == 1) {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 10);
  });
});