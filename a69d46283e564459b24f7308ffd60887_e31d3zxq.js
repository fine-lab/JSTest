run = function (event) {
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  viewModel.on("beforeBatchpush", function (args) {
    debugger;
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let idArray = [];
    let message = "";
    for (let i = 0; i < selectData.length; i++) {
      idArray.push(selectData[i].id);
      let verifystate = selectData[i].verifystate;
      if (2 != verifystate) {
        message += "单号：" + selectData[i].code + "未审核\n";
      }
    }
    if (message.length > 0) {
      cb.utils.alert(message, "error");
      return false;
    }
    let returnPromise = new cb.promise();
    cb.rest.invokeFunction(
      "GT22176AT10.publicFunction.pushOtherCheck",
      {
        ids: idArray
      },
      function (err, res) {
        if (err != undefined) {
          cb.utils.alert(err.message, "error");
          returnPromise.reject();
        }
        if (res != undefined) {
          if (res.message.length > 0) {
            cb.utils.alert(res.message, "error");
            returnPromise.reject();
          } else {
            returnPromise.resolve();
          }
        }
      }
    );
    return returnPromise;
  });
  //根据审核状态控制按钮显示
  gridModel.on("afterSetDataSource", function (data) {
    //获取行数据集合
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        actionState[action.cItemName] = { visible: false };
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
};