viewModel.get("button16fh").on("click", function (data) {
  debugger;
  let gridModel = viewModel.getGridModel();
  let selectedRowIndexes = gridModel.getSelectedRowIndexes();
  if (selectedRowIndexes.length > 0) {
    let id_arr = [];
    for (let i = 0; i < selectedRowIndexes.length; i++) {
      let selectedRowIndexe = selectedRowIndexes[i];
      let row = gridModel.getRowsByIndexes(selectedRowIndexe);
      id_arr.push(row[0].id);
    }
    let currentTime = getCurrentTime();
    let confirming_person = cb.rest.AppContext.user.userName;
    let res = cb.rest.invokeFunction(
      "AT161E5DFA09D00001.apiFunction.realityODConfirm",
      { id_arr: id_arr, currentTime: currentTime, confirming_status: "1", confirming_person: confirming_person },
      function (err, res) {},
      viewModel,
      { async: false }
    );
    if (res.error != undefined) {
      cb.utils.alert("确认失败,原因:" + res.error.message, "error");
    } else {
      if (res.result) {
        if (res.result.err) {
          cb.utils.alert(res.result.err, "error");
        }
      }
      cb.utils.alert("确认成功", "success");
      viewModel.execute("refresh");
    }
  } else {
    cb.utils.alert("请至少选择一条数据", "warning");
  }
});
viewModel.get("button21kd").on("click", function (data) {
  //取消确认--单击
  let gridModel = viewModel.getGridModel();
  let selectedRowIndexes = gridModel.getSelectedRowIndexes();
  if (selectedRowIndexes.length > 0) {
    let id_arr = [];
    for (let i = 0; i < selectedRowIndexes.length; i++) {
      let selectedRowIndexe = selectedRowIndexes[i];
      let row = gridModel.getRowsByIndexes(selectedRowIndexe);
      id_arr.push(row[0].id);
    }
    let currentTime = "";
    let confirming_person = "";
    let res = cb.rest.invokeFunction(
      "AT161E5DFA09D00001.apiFunction.realityODConfirm",
      { id_arr: id_arr, currentTime: currentTime, confirming_status: "0", confirming_person: confirming_person },
      function (err, res) {},
      viewModel,
      { async: false }
    );
    if (res.error != undefined) {
      cb.utils.alert("取消确认失败,原因:" + res.error.message, "error");
    } else {
      if (res.result) {
        if (res.result.err) {
          cb.utils.alert(res.result.err, "error");
        }
      }
      cb.utils.alert("取消确认成功", "success");
      viewModel.execute("refresh");
    }
  } else {
    cb.utils.alert("请至少选择一条数据", "warning");
  }
});
function getCurrentTime() {
  var currentTime = new Date();
  var date = currentTime.toISOString().substr(0, 10);
  var time = currentTime.toTimeString().substr(0, 8);
  return date + " " + time;
}
viewModel.getGridModel().on("afterSetDataSource", () => {
  const rows = viewModel.getGridModel().getRows();
  const actions = viewModel.getGridModel().getCache("actions");
  if (!actions) return;
  const actionsStates = [];
  rows.forEach((data) => {
    const actionState = {};
    actions.forEach((action) => {
      actionState[action.cItemName] = { visible: true };
      if (action.cItemName == "btnCopy" || action.cItemName == "btnDelete") {
        actionState[action.cItemName] = { visible: false };
      } else if (action.cItemName == "btnEdit") {
        let confirming_status = data.confirming_status;
        if (confirming_status == "1") {
          actionState[action.cItemName] = { visible: false };
        }
      }
    });
    actionsStates.push(actionState);
  });
  viewModel.getGridModel().setActionsState(actionsStates);
});