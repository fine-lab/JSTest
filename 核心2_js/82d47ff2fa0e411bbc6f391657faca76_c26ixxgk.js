viewModel.get("button24ii") &&
  viewModel.get("button24ii").on("click", function (data) {
    // 批量新增--单击
    var billdata = {
      billtype: "Voucher", // 单据类型
      billno: "5b4d374f", // 单据号
      params: {
        mode: "edit" // (编辑态edit、新增态add、浏览态browse)
        //传参
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", billdata, viewModel);
  });
var gridModel = viewModel.getGridModel();
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
      if (action.cItemName == "btnDelete" || action.cItemName == "btnEdit") {
        if (data.fpzt != "10") {
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