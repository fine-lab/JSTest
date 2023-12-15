viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  viewModel.on("beforeBatchdelete", function (data) {
    debugger;
    if (typeof data != "undefined") {
      let indexs = gridModel.getSelectedRowIndexes();
      console.log(indexs);
      let dataArr = JSON.parse(data.data.data);
      let errInfo = [];
      for (let i = 0; i < dataArr.length; i++) {
        if (dataArr[i].extend_syzt == "1" || dataArr[i].extend_syzt == 1) {
          errInfo.push("第" + (indexs[i] + 1) + "行的物料已通过首营审批,无法删除 \n ");
        }
      }
      if (errInfo.length > 0) {
        cb.utils.alert(errInfo);
        return false;
      }
    }
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
          if (data.extend_syzt == 1 || data.extend_syzt == "1") {
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