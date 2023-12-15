viewModel.get("button13xg") &&
  viewModel.get("button13xg").on("click", function (data) {
    // 停用--单击
    let focusedRowIndex = viewModel.getGridModel().get("focusedRowIndex");
    let id = viewModel.getGridModel().getCellValue(focusedRowIndex, "id");
    cb.rest.invokeFunction("AT1720668416580001.apiFun.updateStatus", { id: id, status: "0" }, function (err, res) {
      if (err) {
        cb.utils.alert("停用失败！", "error");
      } else {
        cb.utils.alert("停用成功！", "success");
        viewModel.execute("refresh");
      }
    });
  });
viewModel.get("button15le") &&
  viewModel.get("button15le").on("click", function (data) {
    // 启用--单击
    let focusedRowIndex = viewModel.getGridModel().get("focusedRowIndex");
    let id = viewModel.getGridModel().getCellValue(focusedRowIndex, "id");
    let contractNum = viewModel.getGridModel().getCellValue(focusedRowIndex, "contractNum");
    let suanliId = viewModel.getGridModel().getCellValue(focusedRowIndex, "suanliId");
    let suanliType = viewModel.getGridModel().getCellValue(focusedRowIndex, "suanliType");
    cb.rest.invokeFunction("AT1720668416580001.apiFun.updateStatus", { id: id, status: "1", contractNum: contractNum, suanliId: suanliId, suanliType: suanliType }, function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
      } else {
        cb.utils.alert("启用成功！", "success");
        viewModel.execute("refresh");
      }
    });
  });
viewModel.getGridModel().on("afterSetDataSource", function (data) {
  let gridData = viewModel.getGridModel().getData();
  if (!gridData || gridData.length == 0) {
    return;
  }
  debugger;
  let actionsState = viewModel.getGridModel().getCache("actions");
  if (!actionsState) return;
  const actionsStates = [];
  for (let i = 0; i < gridData.length; i++) {
    const actionState = {};
    actionsState.forEach((action) => {
      //设置按钮可用不可用
      actionState[action.cItemName] = { visible: true };
      if (action.cItemName == "button13xg") {
        if (gridData[i].status == "0") {
          // 停用
          actionState[action.cItemName] = { visible: false };
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      } else if (action.cItemName == "button15le") {
        if (gridData[i].status == "0") {
          // 停用
          actionState[action.cItemName] = { visible: true };
        } else {
          actionState[action.cItemName] = { visible: false };
        }
      }
    });
    actionsStates.push(actionState);
  }
  setTimeout(function () {
    viewModel.getGridModel().setActionsState(actionsStates);
  }, 50);
});