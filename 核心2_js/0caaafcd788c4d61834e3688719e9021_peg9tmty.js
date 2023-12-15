viewModel.get("button16pe").on("click", function (data) {
  debugger;
  let gridModel = viewModel.getGridModel();
  let selectedRowIndexes = gridModel.getSelectedRowIndexes();
  if (selectedRowIndexes.length > 0) {
    var errArr = [];
    selectedRowIndexes.forEach((item) => {
      var formData = viewModel.getGridModel().getRowsByIndexes(item)[0];
      if (formData.confirming_status == 1) {
        errArr.push({ orders_no: formData.orders_no, enable: "确认" });
      }
    });
    if (errArr.length > 0) {
      var errMsg = "";
      for (var index = 0; index < errArr.length; index++) {
        errMsg += "出库单号(SO): " + errArr[index].orders_no + "，单据已经属于" + errArr[index].enable + "状态\n";
      }
      cb.utils.confirm(errMsg);
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "initial";
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
      return false;
    }
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
          viewModel.execute("refresh");
          return;
        }
      }
      cb.utils.alert("确认成功", "success");
      viewModel.execute("refresh");
    }
  } else {
    cb.utils.alert("请至少选择一条数据", "warning");
  }
});
viewModel.get("button21hj").on("click", function (data) {
  //取消确认--单击
  let gridModel = viewModel.getGridModel();
  let selectedRowIndexes = gridModel.getSelectedRowIndexes();
  if (selectedRowIndexes.length > 0) {
    var errArr = [];
    selectedRowIndexes.forEach((item) => {
      var formData = viewModel.getGridModel().getRowsByIndexes(item)[0];
      if (formData.confirming_status == 0) {
        errArr.push({ orders_no: formData.orders_no, enable: "取消" });
      }
    });
    if (errArr.length > 0) {
      var errMsg = "";
      for (var index = 0; index < errArr.length; index++) {
        errMsg += "出库单号(SO): " + errArr[index].orders_no + "，单据已经属于" + errArr[index].enable + "状态\n";
      }
      cb.utils.confirm(errMsg);
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "initial";
      document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
      return false;
    }
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
  let rows = viewModel.getGridModel().getRows();
  let actions = viewModel.getGridModel().getCache("actions");
  if (!actions) return;
  let actionsStates = [];
  rows.forEach((data) => {
    let actionState = {};
    actions.forEach((action) => {
      actionState[action.cItemName] = { visible: true };
      if (action.cItemName == "btnCopy") {
        actionState[action.cItemName] = { visible: false };
      } else if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
        let confirming_status = data.confirming_status;
        if (confirming_status == "1") {
          actionState[action.cItemName] = { visible: false };
        }
      }
    });
    actionsStates.push(actionState);
  });
  setTimeout(function () {
    viewModel.getGridModel().setActionsState(actionsStates);
  }, 50);
});